(ns qgameWebapp.core
  (:use [compojure.core :only (defroutes GET)]
        ring.util.response
        ring.middleware.cors
        org.httpkit.server
        qgame.api)
  (:require [compojure.route :as route]
            [compojure.handler :as handler]
            [ring.middleware.reload :as reload]
            [cheshire.core :refer :all]))

(def clients (atom {}))

(defn exec-and-return
  [instructions]
  (let [qsys (->> instructions
                  (execute-program {:num-qubits 2})
                  first)]
    (zipmap [:a :b]
            (map #(probability-of qsys % 1)
                 [0 1]))))

(defn ws
  [req]
  (with-channel req con
    (use 'qgame.api)
    (swap! clients assoc con true)
    (println con " connected")
    (on-receive con
                (fn [received]
                  (println received)
                  (send! con
                         (-> received read-string exec-and-return generate-string)
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
