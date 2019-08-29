#!/usr/bin/env bash

for file in $(find . -name "*.js" -print);
do
	mv "$file" "${file%.js}.tsx";
  git add "${file%.js}.tsx";
done
