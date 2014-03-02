(ns qromp
  (:require [qgame.interpreter.core :as qgame :refer [execute-program
                                                      execute-string]]
            [qgame.utils.amplitudes :as amps :refer [probability-of
                                                     get-phase-of]]
            [cljs.reader :as r]
            [goog.events :as events])) 

(defn response []
  (let [num-qubits (r/read-string js/qubitsInput.value)
        output (->> (js/editor.getValue)
                    r/read-string
                    (qgame/execute-program {:num-qubits num-qubits})
                    first)
        up-state-probs (map #(amps/probability-of output % 0) (range num-qubits))
        up-phases (map #(amps/get-phase-of output % 0) (range num-qubits))
        down-phases (map #(amps/get-phase-of output % 1) (range num-qubits))
        qubit-states (map (fn [up-prob up-phase down-phase]
                            {:UP {:prob up-prob :phase up-phase}
                             :DOWN {:prob (- 1 up-prob) :phase down-phase}})
                          up-state-probs
                          up-phases
                          down-phases)]
    (->> qubit-states
         clj->js
         (set! js/qubits))
    (js/renderQubits)))

(events/listen js/evaluate (.-CLICK events/EventType) response)