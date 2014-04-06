(ns qromp
  (:require [qgame.simulator.interpreter :as qgame :refer [interpret]]
            [qgame.utils.amplitudes :as amps :refer [probability-of
                                                     phase-of
                                                     tangle-of]]
            [qgame.utils.general :as g :refer [bit-size]]
            [qgame.utils.math :as m :refer [round]])) 

(defn evaluate [input callback]
  (let [on-err (fn [_] nil)
        with-err (partial qgame/interpret {:on-err on-err :on-warn on-err})
        output (-> input with-err first)
        num-qubits (-> output :amplitudes count g/bit-size)
        up-state-probs (map (comp #(m/round % 4)
                                  #(amps/probability-of output % 0))
                            (range num-qubits))
        up-phases (map #(amps/phase-of output % 0) (range num-qubits))
        down-phases (map #(amps/phase-of output % 1) (range num-qubits))
        qubit-states (map (fn [up-prob up-phase down-phase]
                            {:up {:prob up-prob :phase up-phase}
                             :down {:prob (- 1 up-prob) :phase down-phase}})
                          up-state-probs
                          up-phases
                          down-phases)]
    (callback (clj->js qubit-states))))

(aset js/window "evaluate" qromp/evaluate)