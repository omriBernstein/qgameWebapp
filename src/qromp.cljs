(ns qromp
  (:require [qgame.simulator.interpreter :as qgame :refer [interpret]]
            [qgame.utils.amplitudes :as amps :refer [probability-of
                                                     phase-of
                                                     tangle-of]]
            [qgame.utils.general :as g :refer [bit-size]]
            [qgame.utils.math :as m :refer [round
                                            abs]])) 

(defn evaluate [input callback]
  (let [on-err (fn [_] nil)
        compiled (atom nil)
        pre-exec (fn [{program :program}]
                   (reset! compiled program))
        with-specs (partial qgame/interpret
                            {:on-err on-err :on-warn on-err
                             :pre-exec pre-exec})
        output (-> input with-specs rand-nth)
        num-qubits (-> output :amplitudes count g/bit-size)
        qubit-coll (range num-qubits)
        up-state-probs (map (comp #(m/round % 4)
                                  #(amps/probability-of output % 0))
                            qubit-coll)
        up-phases (map #(amps/phase-of output % 0) qubit-coll)
        down-phases (map #(amps/phase-of output % 1) qubit-coll)
        qubit-states (map (fn [up-prob up-phase down-phase]
                            {:up {:prob up-prob :phase up-phase}
                             :down {:prob (- 1 up-prob) :phase down-phase}})
                          up-state-probs
                          up-phases
                          down-phases)
        tangle-capacities (map #(->> % (- 0.5) m/abs (* 2) (- 1))
                               up-state-probs)
        tangle-matrix (vec (repeat num-qubits (vec (repeat num-qubits 0))))
        assoc-tangle (fn [mat [a b]]
                       (let [t (amps/tangle-of output a b)]
                         (-> mat
                             (assoc-in [a b] (* t (nth tangle-capacities a)))
                             (assoc-in [b a] (* t (nth tangle-capacities b))))))
        all-pairs (for [[a & remaining] (take num-qubits (iterate rest qubit-coll))
                        b remaining]
                    [a b])
        tangle-matrix (reduce assoc-tangle
                              tangle-matrix
                              all-pairs)
        tangle-matrix (reduce (fn [mat a]
                                (let [unentangled (- 1 (reduce + (nth mat a)))]
                                  (assoc-in mat [a a] unentangled)))
                              tangle-matrix
                              qubit-coll)
        pad-array tangle-capacities
        to-circuit-expressions (fn [program]
                                 (for [expression program]
                                   (let [{{name :name} :fn-meta
                                          line-number :line-number
                                          qubits :qubits} expression
                                         qubits (map (fn [{v :value}]
                                                       {:_value v})
                                                     qubits)
                                         leaner {:_fn_meta {:_name name}
                                                 :_line_number line-number
                                                 :_qubits qubits}]
                                     (->> leaner :_fn_meta :_name
                                          (contains? #{"cnot" "cphase"})
                                          (assoc leaner :_has_target)))))
        circuit-expressions (to-circuit-expressions @compiled)]
    (callback (clj->js qubit-states)
              (clj->js tangle-matrix)
              (clj->js pad-array)
              (clj->js circuit-expressions))))

;(defn into-group
;  [pred group x]
;  (when (pred group x)
;    (conj group x)))
;
;(defn split-step
;  [pred all x]
;  (let [group (peek all)]
;    (if-let [group+ (into-group pred group x)]
;      (conj (pop all) group+)
;      (conj all (conj (empty group) x)))))
;
;(defn split-reduce
;  [pred to-group]
;  (reduce (partial split-step pred)
;          [[]]
;          to-group))
;
;(defn get-qubit-vals
;  [expression]
;  (map :value (:qubits expression)))
;
;(defn block-member?
;  [block expression]
;  (if-let [qubits (get-qubit-vals expression)]
;    (some (set qubits)
;          (mapcat get-qubit-vals block))
;    true))
;
;(defn split-blocks
;  [program]
;  (split-reduce block-member?
;                program))
;
;(defn assign-columns)

(aset js/window "evaluate" qromp/evaluate)