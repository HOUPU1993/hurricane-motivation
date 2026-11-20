# Rebuilding the evacuation order map data

Inputs: the `mandatory_evacuation_geojson` folder (one area + one CBG GeoJSON per hurricane, plus `mandatory_evacuation_orders_index.csv`).

```bash
# 1. Build the order index and one-feature-per-block-group inputs
python3 tools/build_evac_tiles.py /path/to/mandatory_evacuation_geojson /tmp/evac_out

# 2. Build vector tiles (requires tippecanoe >= 2.17)
tippecanoe -o evac/data/areas.pmtiles -l areas -Z3 -z12 --force --no-tile-size-limit \
  --simplification=4 --detect-shared-borders /tmp/evac_out/areas.ndjson
tippecanoe -o evac/data/cbg.pmtiles -l cbg -Z5 -z12 --force --simplification=4 \
  --detect-shared-borders --drop-smallest-as-needed --extend-zooms-if-still-dropping /tmp/evac_out/cbg.ndjson

# 3. Copy the order index
cp /tmp/evac_out/orders.json evac/data/orders.json
```
