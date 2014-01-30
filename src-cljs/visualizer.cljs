(ns visualizer)

(def i (js/$ "#input"))

(def conn 
  (js/WebSocket. "ws://localhost:8080/qgame"))

#_(set! (.-onopen conn)
  (fn [e]
    (.send conn
      (.stringify js/JSON (js-obj "command" "getall")))))

(set! (.-onerror conn) 
  (fn []
    (js/alert "error")
    (.log js/console js/arguments)))

(set! (.-onmessage conn)
  (fn [e]
    (.html (js/$ "#results")
           (str (.html (js/$ "#results"))
                (.-data e) "<br>"))))

(defn send-instruction []
  (.log js/console "sending...")
  (.send conn (.val i)))

(.click (js/$ "#send") send-instruction)

(.keyup (.focus i) 
  (fn [e]
    (if (= (.-which e) 13)
      (send-instruction))))