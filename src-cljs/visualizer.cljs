(ns visualizer
  (:use [c2.core :only [unify]])
  (:use-macros [hiccups.core :only [html]])
  (:require [c2.scale :as scale]
            [hiccups.runtime :as hiccupsrt])) 

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
          s (scale/linear :domain [0 bar-height]
                          :range [0 width])
          data {"A" (s prob-A)
                "B" (s prob-B)}]
      (.log js/console (html (for [[label scaled] data]
                               [:div {:style {:height bar-height
                                              :width scaled
                                              :background-color "gray"}}
                                [:span {:style {:color "white"}} label]])))
      (.log js/console data)
      (.log js/console (unify data (fn [[label prob]]
                     [:div {:style {:height bar-height
                                    :width (s prob)
                                    :background-color "gray"}}
                      [:span {:style {:color "white"}} label]])))
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