(defproject qromp "0.2.0"
  :description ""
  :dependencies [[org.clojure/clojure "1.5.1"]
                 [cheshire "5.2.0"]
                 [ring/ring-devel "1.1.8"]
                 [http-kit "2.0.0"]
                 [compojure "1.1.5"]
                 [ring-cors "0.1.0"]
                 [hiccups "0.3.0"]
                 [org.clojars.hippiccolo/qgame "0.1.2"]
                 [com.keminglabs/c2 "0.2.3"]]
  :plugins [[lein-cljsbuild "0.3.0"]]
  :cljsbuild {:builds [{:source-paths ["src/qromp/frontend/app/visualizer"]
                        :compiler {:output-to "src/qromp/frontend/compiled/app.js"
                                   :optimizations :whitespace
                                   :pretty-print true}}]}
  :main qromp.backend.core
  :min-lein-version "2.0.0")