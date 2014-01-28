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

(defn ws
  [req]
  (with-channel req con
    (swap! clients assoc con true)
    (println con " connected")
    (on-receive con
                (fn [received]
                  (use 'qgame.api)
                  (send! con (generate-string
                               (execute-program {:num-qubits 2}
                                                (list (read-string received))))
                   false)))
    (on-close con (fn [status]
                    (swap! clients dissoc con)
                    (println con " disconnected. status: " status)))))

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
