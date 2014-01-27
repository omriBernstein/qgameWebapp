(ns qgameWebapp.core
  (:use [compojure.core :only (defroutes GET)]
        ring.util.response
        ring.middleware.cors
        org.httpkit.server
        qgame.api) ;;qgame
  (:require [compojure.route :as route]
            [compojure.handler :as handler]
            [ring.middleware.reload :as reload]
            [cheshire.core :refer :all]))

(def clients (atom {}))

(def thing (atom 0))

(defn ws
  [req]
  (with-channel req con
    (swap! clients assoc con true)
    (println con " connected")
    (on-receive con
                (fn [received]
                  (reset! thing (Integer/parseInt received))))
    (on-close con (fn [status]
                    (swap! clients dissoc con)
                    (println con " disconnected. status: " status)))))

(future (loop []
          (doseq [client @clients]
            (send! (key client) (generate-string
                                 {:qgame (-> (execute-program {:num-qubits 1}
                                                               '((qnot 0)))
                                              first
                                              :amplitudes
                                              (nth @thing))})
                   false))
          (Thread/sleep 5000)
          (recur)))

(defroutes routes
  (GET "/qgame" [] ws))

(def application (-> (handler/site routes)
                     reload/wrap-reload
                     (wrap-cors
                      :access-control-allow-origin #".+")))

(defn -main [& args]
  (let [port (Integer/parseInt 
               (or (System/getenv "PORT") "8080"))]
    (run-server application {:port port :join? false})))
