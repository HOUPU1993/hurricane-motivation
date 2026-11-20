"""Build tile inputs and order index for the evacuation-order map."""
import csv, json, os, re, sys

SRC = sys.argv[1]
OUT = sys.argv[2]
os.makedirs(OUT, exist_ok=True)

def bbox_of(geom):
    xs, ys = [], []
    def walk(c):
        if isinstance(c[0], (int, float)):
            xs.append(c[0]); ys.append(c[1])
        else:
            for x in c: walk(x)
    for g in (geom["geometries"] if geom["type"] == "GeometryCollection" else [geom]):
        if g.get("coordinates"):
            walk(g["coordinates"])
    return [round(min(xs), 4), round(min(ys), 4), round(max(xs), 4), round(max(ys), 4)]

def merge(b, c):
    return c if b is None else [min(b[0], c[0]), min(b[1], c[1]), max(b[2], c[2]), max(b[3], c[3])]

index = {r["order_id"]: r for r in csv.DictReader(open(os.path.join(SRC, "mandatory_evacuation_orders_index.csv")))}
keys = sorted({re.match(r"(\d{4}_[A-Za-z]+)_mandatory", f).group(1) for f in os.listdir(SRC) if f.endswith(".geojson")})

hurricanes = []
area_out = open(os.path.join(OUT, "areas.ndjson"), "w")
cbg_out = open(os.path.join(OUT, "cbg.ndjson"), "w")
for hk in keys:
    year, name = hk.split("_", 1)
    area = json.load(open(os.path.join(SRC, f"{hk}_mandatory_evacuation_area.geojson")))
    orders, hb = [], None
    for f in area["features"]:
        p = f["properties"]; oid = p["order_id"]
        if not f.get("geometry"):
            continue
        bb = bbox_of(f["geometry"]); hb = merge(hb, bb)
        ix = index.get(oid, {})
        orders.append({
            "id": oid, "state": p.get("state"), "county": p.get("county"),
            "type": p.get("order_type"), "announce": p.get("announcement_datetime_local") or "", "tz": p.get("time_zone") or "",
            "effective": " ".join(x for x in [p.get("effective_date") or "", p.get("effective_time") or ""] if x),
            "area": p.get("evacuation_area") or "", "zones": p.get("zones") or "",
            "level": p.get("level"), "level_desc": p.get("level_desc") or "", "confidence": p.get("confidence"),
            "mobile": p.get("addon_mobile_home"), "lowlying": p.get("addon_low_lying"),
            "pop": p.get("population_restriction") or "", "record": p.get("record_source") or "", "src": p.get("source_1") or "",
            "note": p.get("geom_note") or "", "warning": p.get("geom_warning") or "",
            "km2": p.get("area_km2"), "n1": int(ix.get("n_bg_ge1pct") or 0), "n50": int(ix.get("n_bg_ge50pct") or 0), "bbox": bb,
        })
        area_out.write(json.dumps({"type": "Feature", "geometry": f["geometry"],
            "properties": {"oid": oid, "hk": hk, "level": p.get("level"), "conf": p.get("confidence")}}) + "\n")
    # one feature per block group per hurricane
    cbg = json.load(open(os.path.join(SRC, f"{hk}_mandatory_evacuation_cbg.geojson")))
    bgs = {}
    for f in cbg["features"]:
        p = f["properties"]; g = p["GEOID"]
        b = bgs.setdefault(g, {"geom": f["geometry"], "pct": 0.0, "oids": [], "incounty": 0})
        b["pct"] = max(b["pct"], float(p.get("pct_bg_in_area") or 0))
        b["oids"].append(p["order_id"])
        b["incounty"] = max(b["incounty"], int(p.get("bg_in_order_county") or 0))
    for g, b in bgs.items():
        if not b["geom"]:
            continue
        cbg_out.write(json.dumps({"type": "Feature", "geometry": b["geom"],
            "properties": {"GEOID": g, "hk": hk, "pct": round(b["pct"], 2), "n": len(set(b["oids"])),
                           "oids": ",".join(sorted(set(b["oids"]))), "inc": b["incounty"]}}) + "\n")
    hurricanes.append({"key": hk, "year": int(year), "name": name, "bbox": hb, "n_bg": len(bgs),
                       "states": sorted({o["state"] for o in orders}), "orders": sorted(orders, key=lambda o: (o["announce"], o["id"]))})
    print(hk, len(orders), "orders", len(bgs), "BGs")
area_out.close(); cbg_out.close()
json.dump({"hurricanes": hurricanes}, open(os.path.join(OUT, "orders.json"), "w"), separators=(",", ":"))
