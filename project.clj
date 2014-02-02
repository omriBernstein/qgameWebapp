(defproject qgameWebapp "0.1.0-SNAPSHOT"
  :description "The qgame web app."
  :dependencies [[org.clojure/clojure "1.5.1"]
                 [cheshire "5.2.0"]
                 [ring/ring-devel "1.1.8"]
                 [http-kit "2.0.0"]
                 [compojure "1.1.5"]
                 [ring-cors "0.1.0"]
                 [hiccup "1.0.0"]
                 [org.clojars.hippiccolo/qgame "0.1.2"]
                 [com.keminglabs/c2 "0.2.3"]]
  :plugins [[lein-cljsbuild "0.3.0"]]
  :cljsbuild {:builds [{:source-paths ["src-cljs"]
                        :compiler {:output-to "static/visualizer.js"
                                   :optimizations :whitespace
                                   :pretty-print true}}]}
  :main qgameWebapp.core
  :min-lein-version "2.0.0")