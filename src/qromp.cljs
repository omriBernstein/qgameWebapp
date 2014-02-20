(ns qromp
  (:require [qgame.interpreter.core :as qgame :refer [execute-program
                                                      execute-string]]
            [cljs.reader :as r]
            [goog.dom :as dom]
            [goog.events :as events])) 

(defn response []
  (let [num-qubits (r/read-string js/qubits.value)]
    (->> (js/editor.getValue)
         r/read-string
         (qgame/execute-program {:num-qubits num-qubits})
         str
         js/console.log)))

(events/listen js/evaluate (.-CLICK events/EventType) response)