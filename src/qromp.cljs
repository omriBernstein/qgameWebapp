(ns qromp
  (:require [qgame.interpreter.core :as qgame :refer [execute-program
                                                      execute-string]]
            [qgame.utils.amplitudes :as amps :refer [probability-of
                                                     get-phase-of]]
            [cljs.reader :as r])) 

(defn evaluate [num-qubits input callback]
  (let [output (->> input
                    r/read-string
                    (qgame/execute-program {:num-qubits num-qubits})
                    first)
        up-state-probs (map #(amps/probability-of output % 0) (range num-qubits))
        up-phases (map #(amps/get-phase-of output % 0) (range num-qubits))
        down-phases (map #(amps/get-phase-of output % 1) (range num-qubits))
        qubit-states (map (fn [up-prob up-phase down-phase]
                            {:up {:prob up-prob :phase up-phase}
                             :down {:prob (- 1 up-prob) :phase down-phase}})
                          up-state-probs
                          up-phases
                          down-phases)]
    (callback (clj->js qubit-states))))

(aset js/window "evaluate" qromp/evaluate)