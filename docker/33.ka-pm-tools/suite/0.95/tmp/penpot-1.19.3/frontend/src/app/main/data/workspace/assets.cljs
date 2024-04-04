;; This Source Code Form is subject to the terms of the Mozilla Public
;; License, v. 2.0. If a copy of the MPL was not distributed with this
;; file, You can obtain one at http://mozilla.org/MPL/2.0/.
;;
;; Copyright (c) KALEIDOS INC

(ns app.main.data.workspace.assets
  "Workspace assets management events and helpers."
  (:require
   [app.util.storage :refer [storage]]))

(defn get-current-assets-ordering
  []
  (let [ordering (::ordering @storage)]
    (or ordering :asc)))

(defn set-current-assets-ordering!
  [ordering]
  (swap! storage assoc ::ordering ordering))

(defn get-current-assets-list-style
  []
  (let [list-style (::list-style @storage)]
    (or list-style :thumbs)))

(defn set-current-assets-list-style!
  [list-style]
  (swap! storage assoc ::list-style list-style))
