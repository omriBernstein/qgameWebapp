(ns visualizer
  (:use [c2.core :only [unify]]
        [hiccup.core :only [html]])
  (:require [c2.scale :as scale]))

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
    (.log js/console e)
    (let [prob-A (.-a (.parse js/JSON (.-data e)))
          prob-B (.-b (.parse js/JSON (.-data e)))
          width 100
          bar-height 100
          data {"A" prob-A
                "B" prob-B}
          s (scale/linear :domain [0 bar-height]
                          :range [0 width])]
      (.html (js/$ "#bars") (html
       (unify data (fn [[label prob]]
                     [:div {:style {:height bar-height
                                    :width (s prob)
                                    :background-color "gray"}}
                      [:span {:style {:color "white"}} label]])))))))

(defn send-instruction []
  (.log js/console "sending...")
  (.send conn (.val i)))

(.click (js/$ "#send") send-instruction)

(.keyup (.focus i) 
  (fn [e]
    (if (= (.-which e) 13)
      (send-instruction))))