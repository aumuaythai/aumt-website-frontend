# gzip everything
gzip -r -9 build/static/

for file in build/static/**/*.gz; do
    mv -- "$file" "${file%%.gz}"
done
