

import os
import sys
import json
from collections import defaultdict
from pprint import pprint as pp


mydecoder = json.JSONDecoder()


"""
with open(os.path.join(os.getcwd(), 'tsa.json')) as f:
    zones = mydecoder.decode(f.read())


with open(os.path.join(os.getcwd(), 'tx-counties_new.json')) as f:
    counties = mydecoder.decode(f.read())


with open(os.path.join(os.getcwd(), 'revisedFormat.js')) as f:
    foo = mydecoder.decode(f.read())


d = defaultdict(list)

for county in counties['features']:
    tsa_id = zones[county['id']]
    d[tsa_id].append(county)


for zone in foo['features']:
    zone['counties'] = d[zone['TSA_id']]


"""

with open(os.path.join(os.getcwd(), 'newbag.json')) as f:
    data = mydecoder.decode(f.read())

with open(os.path.join(os.getcwd(), 'poop'), 'w') as f:
    f.write(json.dumps(data, sort_keys=True))

