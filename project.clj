(defproject qromp "0.4.0"
  :description ""
  :dependencies [[org.clojure/clojure "1.5.1"]
                 [org.clojure/clojurescript "0.0-2156"]
                 [org.clojars/hippiccolo/qgame "0.2.5"]]
  :plugins [[lein-cljsbuild "1.0.2"]]
  :cljsbuild {:builds [{:source-paths ["src"]
                        :compiler {:output-to "static/qromp.js"
                                   :optimizations :whitespace
                                   :pretty-print true
                                   :foreign-libs [{:file "http://cdnjs.cloudflare.com/ajax/libs/mathjs/0.18.1/math.min.js"
                                                   :provides ["math.js"]}]}}]}
  :min-lein-version "2.0.0")