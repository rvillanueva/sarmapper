module.exports = {
  names: {
    profiles: {
      abandonedvehicle: 'Abandoned Vehicle',
      abduction: 'Abduction',
      angler: 'Angler',
      atv: 'ATV',
      autistic: 'Autistic',
      camper: 'Camper',
      caver: 'Caver',
      child1to3: 'Child (1 - 3 years)',
      child4to6: 'Child (4 - 6 years)',
      child7to9: 'Child (7 - 9 years)',
      child10to12: 'Child (10 - 12 years)',
      child13to15: 'Child (13 - 15 years)',
      climber: 'Climber',
      dementia: 'Dementia',
      despondent: 'Despondent',
      fourwd: 'Four Wheel Drive',
      gatherer: 'Gatherer',
      hiker: 'Hiker',
      horsebackrider: 'Horseback Rider',
      hunter: 'Hunter',
      mentaldisability: 'Mental Disability',
      mentalillness: 'Mental Illness',
      mountainbiker: 'Mountain Biker',
      runner: 'Runner',
      skieralpine: 'Skier (Alpine)',
      skiernordic: 'Skier (Nordic)',
      snowboarder: 'Snowboarder',
      snowmobiler: 'Snowmobiler',
      snowshoer: 'Snowshoer',
      substanceabuse: 'Substance Abuse',
      vehicle: 'Vehicle',
      worker: 'Worker'
    },
    environments: {
      temperate: 'Temperate',
      dry: 'Dry',
      urban: 'Urban'
    },
    terrain: {
      flat: 'Flat',
      mtn: 'Mountain'
    }
  },
  behaviors: [
    {
      "_id": "abduction",
      "n": 735,
      "name": "Abduction",
      "hierarchy": [
        "abduction"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0.3,
        2.4,
        19.3,
        0
      ],
      "dispersion": null
    },
    {
      "_id": "angler__temperate__mtn",
      "n": 25,
      "name": "Mountain",
      "hierarchy": [
        "angler",
        "temperate",
        "mtn"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0.3,
        1.5,
        5.5,
        9.9
      ],
      "dispersion": null
    },
    {
      "_id": "angler__temperate__flat",
      "n": 62,
      "name": "Flat",
      "hierarchy": [
        "angler",
        "temperate",
        "flat"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0.8,
        1.6,
        3.9,
        14.9
      ],
      "dispersion": null
    },
    {
      "_id": "angler__temperate__dispersion",
      "n": 17,
      "hierarchy": [
        "angler",
        "temperate",
        "dispersion"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        28,
        50,
        59,
        111
      ],
      "dispersion": null
    },
    {
      "_id": "angler__dry",
      "n": 15,
      "name": "Dry",
      "hierarchy": [
        "angler",
        "dry"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        3.2,
        9.7,
        10.5,
        13
      ],
      "dispersion": null
    },
    {
      "_id": "atv__temperate__mtn",
      "n": 19,
      "name": "Mountain",
      "hierarchy": [
        "atv",
        "temperate",
        "mtn"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        1.6,
        3.2,
        5.6,
        8
      ],
      "dispersion": null
    },
    {
      "_id": "autistic__temperate",
      "n": 20,
      "name": "Temperate",
      "hierarchy": [
        "autistic",
        "temperate"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0.6,
        1.6,
        3.7,
        15.2
      ],
      "dispersion": null
    },
    {
      "_id": "autistic__urban",
      "n": 16,
      "name": "Urban",
      "hierarchy": [
        "autistic",
        "urban"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0.3,
        1,
        3.8,
        8
      ],
      "dispersion": null
    },
    {
      "_id": "camper__temperate__mtn",
      "n": 17,
      "name": "Mountain",
      "hierarchy": [
        "camper",
        "temperate",
        "mtn"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0.2,
        2.2,
        3,
        39.5
      ],
      "dispersion": null
    },
    {
      "_id": "camper__temperate__flat",
      "n": 18,
      "name": "Flat",
      "hierarchy": [
        "camper",
        "temperate",
        "flat"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0.2,
        1.1,
        3.2,
        12.8
      ],
      "dispersion": null
    },
    {
      "_id": "camper__dry__mtn",
      "n": 26,
      "name": "Mountain",
      "hierarchy": [
        "camper",
        "dry",
        "mtn"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0.6,
        1.6,
        4.2,
        32.5
      ],
      "dispersion": null
    },
    {
      "_id": "caver__temperate",
      "n": 7,
      "name": "Temperate",
      "hierarchy": [
        "caver",
        "temperate"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0,
        0.1,
        0,
        0
      ],
      "dispersion": null
    },
    {
      "_id": "child1to3__temperate__mtn",
      "n": 58,
      "name": "Mountain",
      "hierarchy": [
        "child1to3",
        "temperate",
        "mtn"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0.2,
        0.3,
        0.6,
        4.5
      ],
      "dispersion": null
    },
    {
      "_id": "child1to3__temperate__flat",
      "n": 61,
      "name": "Flat",
      "hierarchy": [
        "child1to3",
        "temperate",
        "flat"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0.2,
        0.3,
        1,
        3.2
      ],
      "dispersion": null
    },
    {
      "_id": "child1to3__temperate__dispersion",
      "n": 36,
      "hierarchy": [
        "child1to3",
        "temperate",
        "dispersion"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0,
        23,
        66,
        137
      ],
      "dispersion": null
    },
    {
      "_id": "child1to3__dry",
      "n": 13,
      "name": "Dry",
      "hierarchy": [
        "child1to3",
        "dry"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0.6,
        1.3,
        3.9,
        9
      ],
      "dispersion": null
    },
    {
      "_id": "child1to3__urban",
      "n": 17,
      "name": "Urban",
      "hierarchy": [
        "child1to3",
        "urban"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0.1,
        0.3,
        0.5,
        0.7
      ],
      "dispersion": null
    },
    {
      "_id": "child4to6__temperate__mtn",
      "n": 38,
      "name": "Mountain",
      "hierarchy": [
        "child4to6",
        "temperate",
        "mtn"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0.2,
        0.8,
        1.5,
        3.7
      ],
      "dispersion": null
    },
    {
      "_id": "child4to6__temperate__flat",
      "n": 90,
      "name": "Flat",
      "hierarchy": [
        "child4to6",
        "temperate",
        "flat"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0.2,
        0.6,
        1.5,
        6.6
      ],
      "dispersion": null
    },
    {
      "_id": "child4to6__temperate__dispersion",
      "n": 36,
      "hierarchy": [
        "child4to6",
        "temperate",
        "dispersion"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0,
        23,
        66,
        137
      ],
      "dispersion": null
    },
    {
      "_id": "child4to6__dry",
      "n": 19,
      "name": "Dry",
      "hierarchy": [
        "child4to6",
        "dry"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0.6,
        1.9,
        3.2,
        8.2
      ],
      "dispersion": null
    },
    {
      "_id": "child4to6__urban",
      "n": 25,
      "name": "Urban",
      "hierarchy": [
        "child4to6",
        "urban"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0.1,
        0.5,
        1,
        3.4
      ],
      "dispersion": null
    },
    {
      "_id": "child7to9__temperate__mtn",
      "n": 38,
      "name": "Mountain",
      "hierarchy": [
        "child7to9",
        "temperate",
        "mtn"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0.8,
        1.6,
        3.2,
        11.3
      ],
      "dispersion": null
    },
    {
      "_id": "child7to9__temperate__flat",
      "n": 79,
      "name": "Flat",
      "hierarchy": [
        "child7to9",
        "temperate",
        "flat"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0.2,
        0.8,
        2,
        8
      ],
      "dispersion": null
    },
    {
      "_id": "child7to9__temperate__dispersion",
      "n": 28,
      "hierarchy": [
        "child7to9",
        "temperate",
        "dispersion"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        21,
        40,
        57,
        146
      ],
      "dispersion": null
    },
    {
      "_id": "child7to9__dry__mtn",
      "n": 18,
      "name": "Mountain",
      "hierarchy": [
        "child7to9",
        "dry",
        "mtn"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0.4,
        1.2,
        3.2,
        7.2
      ],
      "dispersion": null
    },
    {
      "_id": "child7to9__urban",
      "n": 22,
      "name": "Urban",
      "hierarchy": [
        "child7to9",
        "urban"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0.2,
        0.5,
        1.5,
        5.2
      ],
      "dispersion": null
    },
    {
      "_id": "child10to12__temperate__mtn",
      "n": 72,
      "name": "Mountain",
      "hierarchy": [
        "child10to12",
        "temperate",
        "mtn"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0.8,
        1.6,
        3.2,
        9
      ],
      "dispersion": null
    },
    {
      "_id": "child10to12__temperate__flat",
      "n": 57,
      "name": "Flat",
      "hierarchy": [
        "child10to12",
        "temperate",
        "flat"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0.4,
        1.6,
        4.8,
        10
      ],
      "dispersion": null
    },
    {
      "_id": "child10to12__temperate__dispersion",
      "n": 28,
      "hierarchy": [
        "child10to12",
        "temperate",
        "dispersion"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        21,
        40,
        57,
        146
      ],
      "dispersion": null
    },
    {
      "_id": "child10to12__dry__mtn",
      "n": 22,
      "name": "Mountain",
      "hierarchy": [
        "child10to12",
        "dry",
        "mtn"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0.8,
        2,
        7.2,
        16.1
      ],
      "dispersion": null
    },
    {
      "_id": "child10to12__dry__flat",
      "n": 7,
      "name": "Flat",
      "hierarchy": [
        "child10to12",
        "dry",
        "flat"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0,
        0,
        3.2,
        0
      ],
      "dispersion": null
    },
    {
      "_id": "child10to12__urban",
      "n": 18,
      "name": "Urban",
      "hierarchy": [
        "child10to12",
        "urban"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0.3,
        1.5,
        2.9,
        5.8
      ],
      "dispersion": null
    },
    {
      "_id": "child13to15__temperate__mtn",
      "n": 74,
      "name": "Mountain",
      "hierarchy": [
        "child13to15",
        "temperate",
        "mtn"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0.8,
        2.1,
        4.8,
        21.4
      ],
      "dispersion": null
    },
    {
      "_id": "child13to15__temperate__flat",
      "n": 80,
      "name": "Flat",
      "hierarchy": [
        "child13to15",
        "temperate",
        "flat"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0.6,
        1.3,
        3.2,
        10
      ],
      "dispersion": null
    },
    {
      "_id": "child13to15__temperate__dispersion",
      "n": 9,
      "hierarchy": [
        "child13to15",
        "temperate",
        "dispersion"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0,
        6,
        48,
        139
      ],
      "dispersion": null
    },
    {
      "_id": "child13to15__dry__mtn",
      "n": 19,
      "name": "Mountain",
      "hierarchy": [
        "child13to15",
        "dry",
        "mtn"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        2.4,
        3.2,
        4.8,
        11.9
      ],
      "dispersion": null
    },
    {
      "_id": "climber__temperate",
      "n": 25,
      "name": "Temperate",
      "hierarchy": [
        "climber",
        "temperate"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0.2,
        1.6,
        3.2,
        14.7
      ],
      "dispersion": {
        "n": 6,
        "p25": 5,
        "p50": 28,
        "p75": 50,
        "p95": 146
      }
    },
    {
      "_id": "climber__dry",
      "n": 7,
      "name": "Dry",
      "hierarchy": [
        "climber",
        "dry"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0,
        4.8,
        0,
        0
      ],
      "dispersion": null
    },
    {
      "_id": "dementia__temperate__mtn",
      "n": 95,
      "name": "Mountain",
      "hierarchy": [
        "dementia",
        "temperate",
        "mtn"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0.3,
        0.8,
        1.9,
        8.3
      ],
      "dispersion": null
    },
    {
      "_id": "dementia__temperate__flat",
      "n": 175,
      "name": "Flat",
      "hierarchy": [
        "dementia",
        "temperate",
        "flat"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0.3,
        0.8,
        2.4,
        12.8
      ],
      "dispersion": null
    },
    {
      "_id": "dementia__temperate__dispersion",
      "n": 11,
      "hierarchy": [
        "dementia",
        "temperate",
        "dispersion"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        11,
        23,
        66,
        70
      ],
      "dispersion": null
    },
    {
      "_id": "dementia__dry__mtn",
      "n": 14,
      "name": "Mountain",
      "hierarchy": [
        "dementia",
        "dry",
        "mtn"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        1,
        1.9,
        3.1,
        6.1
      ],
      "dispersion": null
    },
    {
      "_id": "dementia__dry__flat",
      "n": 15,
      "name": "Flat",
      "hierarchy": [
        "dementia",
        "dry",
        "flat"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0.5,
        1.6,
        3.6,
        11.8
      ],
      "dispersion": null
    },
    {
      "_id": "dementia__urban",
      "n": 336,
      "name": "Urban",
      "hierarchy": [
        "dementia",
        "urban"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0.3,
        1.1,
        3.2,
        12.6
      ],
      "dispersion": null
    },
    {
      "_id": "despondent__temperate__mtn",
      "n": 103,
      "name": "Mountain",
      "hierarchy": [
        "despondent",
        "temperate",
        "mtn"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0.3,
        1.1,
        3.2,
        21.6
      ],
      "dispersion": null
    },
    {
      "_id": "despondent__temperate__flat",
      "n": 193,
      "name": "Flat",
      "hierarchy": [
        "despondent",
        "temperate",
        "flat"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0.3,
        0.8,
        2.3,
        17.3
      ],
      "dispersion": null
    },
    {
      "_id": "despondent__temperate__dispersion",
      "n": 6,
      "hierarchy": [
        "despondent",
        "temperate",
        "dispersion"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0,
        0,
        3,
        30
      ],
      "dispersion": null
    },
    {
      "_id": "despondent__dry__mtn",
      "n": 20,
      "name": "Mountain",
      "hierarchy": [
        "despondent",
        "dry",
        "mtn"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0.8,
        1.6,
        3.4,
        18
      ],
      "dispersion": null
    },
    {
      "_id": "despondent__dry__flat",
      "n": 14,
      "name": "Flat",
      "hierarchy": [
        "despondent",
        "dry",
        "flat"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0.5,
        1.9,
        3.7,
        20.7
      ],
      "dispersion": null
    },
    {
      "_id": "despondent__urban",
      "n": 96,
      "name": "Urban",
      "hierarchy": [
        "despondent",
        "urban"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0.1,
        0.5,
        1.5,
        13.1
      ],
      "dispersion": null
    },
    {
      "_id": "gatherer__temperate__mtn",
      "n": 94,
      "name": "Mountain",
      "hierarchy": [
        "gatherer",
        "temperate",
        "mtn"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        1.5,
        3.2,
        6.4,
        12.9
      ],
      "dispersion": null
    },
    {
      "_id": "gatherer__dry",
      "n": 14,
      "name": "Dry",
      "hierarchy": [
        "gatherer",
        "dry"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        1.6,
        2.6,
        5.8,
        11.1
      ],
      "dispersion": null
    },
    {
      "_id": "hiker__temperate__mtn",
      "n": 568,
      "name": "Mountain",
      "hierarchy": [
        "hiker",
        "temperate",
        "mtn"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        1.1,
        3.1,
        5.8,
        18.3
      ],
      "dispersion": null
    },
    {
      "_id": "hiker__temperate__flat",
      "n": 274,
      "name": "Flat",
      "hierarchy": [
        "hiker",
        "temperate",
        "flat"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0.6,
        1.8,
        3.2,
        9.9
      ],
      "dispersion": null
    },
    {
      "_id": "hiker__temperate__dispersion",
      "n": 134,
      "hierarchy": [
        "hiker",
        "temperate",
        "dispersion"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        2,
        23,
        64,
        132
      ],
      "dispersion": null
    },
    {
      "_id": "hiker__dry__mtn",
      "n": 221,
      "name": "Mountain",
      "hierarchy": [
        "hiker",
        "dry",
        "mtn"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        1.6,
        3.2,
        6.5,
        19.3
      ],
      "dispersion": null
    },
    {
      "_id": "hiker__dry__flat",
      "n": 58,
      "name": "Flat",
      "hierarchy": [
        "hiker",
        "dry",
        "flat"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        1.3,
        2.1,
        6.6,
        13.1
      ],
      "dispersion": null
    },
    {
      "_id": "hiker__dry__dispersion",
      "n": 28,
      "hierarchy": [
        "hiker",
        "dry",
        "dispersion"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        20,
        47,
        124,
        175
      ],
      "dispersion": null
    },
    {
      "_id": "hiker__urban",
      "n": 8,
      "name": "Urban",
      "hierarchy": [
        "hiker",
        "urban"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0,
        2.6,
        0,
        0
      ],
      "dispersion": null
    },
    {
      "_id": "horsebackrider",
      "n": 17,
      "name": "Horseback Rider",
      "hierarchy": [
        "horsebackrider"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0.3,
        3.2,
        8.1,
        19.8
      ],
      "dispersion": null
    },
    {
      "_id": "hunter__temperate__mtn",
      "n": 355,
      "name": "Mountain",
      "hierarchy": [
        "hunter",
        "temperate",
        "mtn"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        1,
        2.1,
        4.8,
        17.2
      ],
      "dispersion": null
    },
    {
      "_id": "hunter__temperate__flat",
      "n": 465,
      "name": "Flat",
      "hierarchy": [
        "hunter",
        "temperate",
        "flat"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0.6,
        1.6,
        3.1,
        13.7
      ],
      "dispersion": null
    },
    {
      "_id": "hunter__temperate__dispersion",
      "n": 196,
      "hierarchy": [
        "hunter",
        "temperate",
        "dispersion"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        12,
        45,
        90,
        156
      ],
      "dispersion": null
    },
    {
      "_id": "hunter__dry__mtn",
      "n": 138,
      "name": "Mountain",
      "hierarchy": [
        "hunter",
        "dry",
        "mtn"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        2.1,
        4.8,
        8.1,
        22.2
      ],
      "dispersion": null
    },
    {
      "_id": "hunter__dry__flat",
      "n": 40,
      "name": "Flat",
      "hierarchy": [
        "hunter",
        "dry",
        "flat"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        1.6,
        3.1,
        6.4,
        11.3
      ],
      "dispersion": null
    },
    {
      "_id": "mentalillness__temperate__mtn",
      "n": 23,
      "name": "Mountain",
      "hierarchy": [
        "mentalillness",
        "temperate",
        "mtn"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0.6,
        2.3,
        8.3,
        14.6
      ],
      "dispersion": null
    },
    {
      "_id": "mentalillness__temperate__flat",
      "n": 23,
      "name": "Flat",
      "hierarchy": [
        "mentalillness",
        "temperate",
        "flat"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0.8,
        1,
        2.3,
        8.1
      ],
      "dispersion": null
    },
    {
      "_id": "mentalillness__dry__mtn",
      "n": 32,
      "name": "Mountain",
      "hierarchy": [
        "mentalillness",
        "dry",
        "mtn"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        1.7,
        4,
        8.2,
        18.1
      ],
      "dispersion": null
    },
    {
      "_id": "mentalillness__urban",
      "n": 38,
      "name": "Urban",
      "hierarchy": [
        "mentalillness",
        "urban"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0.3,
        0.6,
        1.5,
        12.5
      ],
      "dispersion": null
    },
    {
      "_id": "mentaldisability__temperate__mtn",
      "n": 31,
      "name": "Mountain",
      "hierarchy": [
        "mentaldisability",
        "temperate",
        "mtn"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0.6,
        1.6,
        3.2,
        11.3
      ],
      "dispersion": null
    },
    {
      "_id": "mentaldisability__temperate__flat",
      "n": 36,
      "name": "Flat",
      "hierarchy": [
        "mentaldisability",
        "temperate",
        "flat"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0.3,
        1,
        2.1,
        11.8
      ],
      "dispersion": null
    },
    {
      "_id": "mentaldisability__dry",
      "n": 21,
      "name": "Dry",
      "hierarchy": [
        "mentaldisability",
        "dry"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        1.1,
        4,
        8.7,
        62.6
      ],
      "dispersion": null
    },
    {
      "_id": "mentaldisability__urban",
      "n": 44,
      "name": "Urban",
      "hierarchy": [
        "mentaldisability",
        "urban"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0.3,
        0.8,
        3.7,
        9.9
      ],
      "dispersion": null
    },
    {
      "_id": "mountainbiker__temperate__mtn",
      "n": 25,
      "name": "Mountain",
      "hierarchy": [
        "mountainbiker",
        "temperate",
        "mtn"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        3.1,
        4,
        11.3,
        25
      ],
      "dispersion": null
    },
    {
      "_id": "mountainbiker__dry",
      "n": 21,
      "name": "Dry",
      "hierarchy": [
        "mountainbiker",
        "dry"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        1.1,
        4,
        8.7,
        62.6
      ],
      "dispersion": {
        "n": 28,
        "p25": 21,
        "p50": 40,
        "p75": 57,
        "p95": 146
      }
    },
    {
      "_id": "mountainbiker__urban",
      "n": 44,
      "name": "Urban",
      "hierarchy": [
        "mountainbiker",
        "urban"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0.3,
        0.8,
        3.7,
        9.9
      ],
      "dispersion": null
    },
    {
      "_id": "runner__temperate",
      "n": 14,
      "name": "Temperate",
      "hierarchy": [
        "runner",
        "temperate"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        1.4,
        2.6,
        3.4,
        5.8
      ],
      "dispersion": null
    },
    {
      "_id": "skieralpine__temperate__mtn",
      "n": 16,
      "name": "Mountain",
      "hierarchy": [
        "skieralpine",
        "temperate",
        "mtn"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        1.1,
        2.7,
        4.8,
        15.2
      ],
      "dispersion": null
    },
    {
      "_id": "skieralpine__dry",
      "n": 8,
      "name": "Dry",
      "hierarchy": [
        "skieralpine",
        "dry"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0,
        4.8,
        0,
        0
      ],
      "dispersion": null
    },
    {
      "_id": "skiernordic__temperate__mtn",
      "n": 29,
      "name": "Mountain",
      "hierarchy": [
        "skiernordic",
        "temperate",
        "mtn"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        1.6,
        3.5,
        6.4,
        19.6
      ],
      "dispersion": null
    },
    {
      "_id": "skiernordic__temperate__flat",
      "n": 0,
      "name": "Flat",
      "hierarchy": [
        "skiernordic",
        "temperate",
        "flat"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0,
        0,
        0,
        0
      ],
      "dispersion": null
    },
    {
      "_id": "skiernordic__dry__mtn",
      "n": 41,
      "name": "Mountain",
      "hierarchy": [
        "skiernordic",
        "dry",
        "mtn"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        1.9,
        4.3,
        6.4,
        19.5
      ],
      "dispersion": null
    },
    {
      "_id": "skiernordic__dry__dispersion",
      "n": 22,
      "hierarchy": [
        "skiernordic",
        "dry",
        "dispersion"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        16,
        48,
        149,
        165
      ],
      "dispersion": null
    },
    {
      "_id": "snowboarder__temperate__mtn",
      "n": 31,
      "name": "Mountain",
      "hierarchy": [
        "snowboarder",
        "temperate",
        "mtn"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        1.6,
        3.2,
        6.2,
        15.4
      ],
      "dispersion": null
    },
    {
      "_id": "snowmobiler__temperate__mtn",
      "n": 26,
      "name": "Mountain",
      "hierarchy": [
        "snowmobiler",
        "temperate",
        "mtn"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        3.2,
        6.4,
        11.1,
        16.1
      ],
      "dispersion": null
    },
    {
      "_id": "snowmobiler__temperate__flat",
      "n": 14,
      "name": "Flat",
      "hierarchy": [
        "snowmobiler",
        "temperate",
        "flat"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0.8,
        2.9,
        25.5,
        59.7
      ],
      "dispersion": null
    },
    {
      "_id": "snowmobiler__temperate__dispersion",
      "n": 11,
      "hierarchy": [
        "snowmobiler",
        "temperate",
        "dispersion"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        7,
        11,
        58,
        169
      ],
      "dispersion": null
    },
    {
      "_id": "snowmobiler__dry__mtn",
      "n": 22,
      "name": "Mountain",
      "hierarchy": [
        "snowmobiler",
        "dry",
        "mtn"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        1,
        3,
        8.7,
        18.9
      ],
      "dispersion": null
    },
    {
      "_id": "snowshoer",
      "n": 7,
      "name": "Snowshoer",
      "hierarchy": [
        "snowshoer"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0,
        1,
        0,
        3
      ],
      "dispersion": null
    },
    {
      "_id": "substanceabuse__temperate",
      "n": 15,
      "name": "Temperate",
      "hierarchy": [
        "substanceabuse",
        "temperate"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0.3,
        0.7,
        2.6,
        6
      ],
      "dispersion": null
    },
    {
      "_id": "substanceabuse__urban",
      "n": 6,
      "name": "Urban",
      "hierarchy": [
        "substanceabuse",
        "urban"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0,
        1.2,
        0,
        0
      ],
      "dispersion": null
    },
    {
      "_id": "vehicle",
      "n": 84,
      "name": "Vehicle",
      "hierarchy": [
        "vehicle"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        2,
        5,
        12,
        62.67
      ],
      "dispersion": null
    },
    {
      "_id": "fourwd",
      "n": 19,
      "name": "Four-Wheel Drive",
      "hierarchy": [
        "fourwd"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0,
        3.3,
        6.4,
        11.6
      ],
      "dispersion": null
    },
    {
      "_id": "abandonedvehicle",
      "n": 11,
      "name": "Abandoned Vehicle",
      "hierarchy": [
        "abandonedvehicle"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0.6,
        2,
        4.4,
        9.1
      ],
      "dispersion": null
    },
    {
      "_id": "worker__temperate__mtn",
      "n": 29,
      "name": "Mountain",
      "hierarchy": [
        "worker",
        "temperate",
        "mtn"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        1,
        1.9,
        3.2,
        11.8
      ],
      "dispersion": null
    },
    {
      "_id": "worker__temperate__flat",
      "n": 11,
      "name": "Flat",
      "hierarchy": [
        "worker",
        "temperate",
        "flat"
      ],
      "distanceNames": [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      "distances": [
        0,
        0.4,
        0,
        0
      ],
      "dispersion": null
    }
  ],
  dispersionAverage: {
    "stats": {
      "n": 532,
      "p25": 10,
      "p50": 30,
      "p75": 78,
      "p95": 144
    }
  }
}
