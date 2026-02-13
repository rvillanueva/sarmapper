export const names = {
  profiles: {
    abandonedvehicle: "Abandoned Vehicle",
    abduction: "Abduction",
    angler: "Angler",
    atv: "ATV",
    autistic: "Autistic",
    camper: "Camper",
    caver: "Caver",
    child1to3: "Child (1 - 3 years)",
    child4to6: "Child (4 - 6 years)",
    child7to9: "Child (7 - 9 years)",
    child10to12: "Child (10 - 12 years)",
    child13to15: "Child (13 - 15 years)",
    climber: "Climber",
    dementia: "Dementia",
    despondent: "Despondent",
    fourwd: "Four Wheel Drive",
    gatherer: "Gatherer",
    hiker: "Hiker",
    horsebackrider: "Horseback Rider",
    hunter: "Hunter",
    mentaldisability: "Mental Disability",
    mentalillness: "Mental Illness",
    mountainbiker: "Mountain Biker",
    runner: "Runner",
    skieralpine: "Skier (Alpine)",
    skiernordic: "Skier (Nordic)",
    snowboarder: "Snowboarder",
    snowmobiler: "Snowmobiler",
    snowshoer: "Snowshoer",
    substanceabuse: "Substance Abuse",
    vehicle: "Vehicle",
    worker: "Worker",
  },
  environments: {
    temperate: "Temperate",
    dry: "Dry",
    urban: "Urban",
  },
  terrain: {
    flat: "Flat",
    mtn: "Mountain",
  },
};
export const dispersions = [
  {
    hierarchy: [],
    n: 532,
    angles: {
      p25: 10,
      p50: 30,
      p75: 78,
      p95: 144,
    },
  },
  {
    hierarchy: ["angler"],
    n: 17,
    angles: {
      p25: 28,
      p50: 50,
      p75: 59,
      p95: 111,
    },
  },
  {
    hierarchy: ["child1to3", "temperate"],
    n: 36,
    angles: {
      p25: 0,
      p50: 23,
      p75: 66,
      p95: 137,
    },
  },
  {
    hierarchy: ["child4to6", "temperate"],
    n: 36,
    angles: {
      p25: 0,
      p50: 23,
      p75: 66,
      p95: 137,
    },
  },
  {
    hierarchy: ["child7to9", "temperate"],
    n: 28,
    angles: {
      p25: 21,
      p50: 40,
      p75: 57,
      p95: 146,
    },
  },
  {
    hierarchy: ["child10to12", "temperate"],
    n: 28,
    angles: {
      p25: 21,
      p50: 40,
      p75: 57,
      p95: 146,
    },
  },
  {
    hierarchy: ["child13to15", "temperate"],
    n: 9,
    angles: {
      p25: 0,
      p50: 6,
      p75: 48,
      p95: 139,
    },
  },
  {
    hierarchy: ["climber", "temperate"],
    n: 6,
    angles: {
      p25: 5,
      p50: 28,
      p75: 50,
      p95: 146,
    },
  },
  {
    hierarchy: ["dementia", "temperate"],
    n: 11,
    angles: {
      p25: 11,
      p50: 23,
      p75: 66,
      p95: 70,
    },
  },
  {
    hierarchy: ["despondent", "temperate"],
    n: 6,
    angles: {
      p25: 0,
      p50: 0,
      p75: 3,
      p95: 30,
    },
  },
  {
    hierarchy: ["hiker", "temperate"],
    n: 134,
    angles: {
      p25: 2,
      p50: 23,
      p75: 64,
      p95: 132,
    },
  },
  {
    hierarchy: ["hiker", "dry"],
    n: 28,
    angles: {
      p25: 20,
      p50: 47,
      p75: 124,
      p95: 175,
    },
  },
  {
    hierarchy: ["hunter", "temperate"],
    n: 196,
    angles: {
      p25: 12,
      p50: 45,
      p75: 90,
      p95: 156,
    },
  },
  {
    hierarchy: ["mountainbiker", "dry"],
    n: 28,
    angles: {
      p25: 21,
      p50: 40,
      p75: 57,
      p95: 146,
    },
  },
  {
    hierarchy: ["skiernordic", "dry"],
    n: 22,
    angles: {
      p25: 16,
      p50: 48,
      p75: 149,
      p95: 165,
    },
  },
  {
    hierarchy: ["snowmobiler", "temperate"],
    n: 11,
    angles: {
      p25: 7,
      p50: 11,
      p75: 58,
      p95: 169,
    },
  },
];
export const profiles = {
  abduction: {
    children: null,
    behavior: {
      _id: "abduction",
      n: 735,
      hierarchy: ["abduction"],
      distances: [0.3, 2.4, 19.3, 0],
    },
  },
  angler: {
    children: {
      temperate: {
        children: {
          mtn: {
            children: null,
            behavior: {
              _id: "angler__temperate__mtn",
              n: 25,
              hierarchy: ["angler", "temperate", "mtn"],
              distances: [0.3, 1.5, 5.5, 9.9],
            },
          },
          flat: {
            children: null,
            behavior: {
              _id: "angler__temperate__flat",
              n: 62,
              hierarchy: ["angler", "temperate", "flat"],
              distances: [0.8, 1.6, 3.9, 14.9],
            },
          },
          dispersion: {
            children: null,
            behavior: {
              _id: "angler__temperate__dispersion",
              n: 17,
              hierarchy: ["angler", "temperate", "dispersion"],
              distances: [28, 50, 59, 111],
            },
          },
        },
        behavior: null,
      },
      dry: {
        children: null,
        behavior: {
          _id: "angler__dry",
          n: 15,
          hierarchy: ["angler", "dry"],
          distances: [3.2, 9.7, 10.5, 13],
        },
      },
    },
    behavior: null,
  },
  atv: {
    children: {
      temperate: {
        children: {
          mtn: {
            children: null,
            behavior: {
              _id: "atv__temperate__mtn",
              n: 19,
              hierarchy: ["atv", "temperate", "mtn"],
              distances: [1.6, 3.2, 5.6, 8],
            },
          },
        },
        behavior: null,
      },
    },
    behavior: null,
  },
  autistic: {
    children: {
      temperate: {
        children: null,
        behavior: {
          _id: "autistic__temperate",
          n: 20,
          hierarchy: ["autistic", "temperate"],
          distances: [0.6, 1.6, 3.7, 15.2],
        },
      },
      urban: {
        children: null,
        behavior: {
          _id: "autistic__urban",
          n: 16,
          hierarchy: ["autistic", "urban"],
          distances: [0.3, 1, 3.8, 8],
        },
      },
    },
    behavior: null,
  },
  camper: {
    children: {
      temperate: {
        children: {
          mtn: {
            children: null,
            behavior: {
              _id: "camper__temperate__mtn",
              n: 17,
              hierarchy: ["camper", "temperate", "mtn"],
              distances: [0.2, 2.2, 3, 39.5],
            },
          },
          flat: {
            children: null,
            behavior: {
              _id: "camper__temperate__flat",
              n: 18,
              hierarchy: ["camper", "temperate", "flat"],
              distances: [0.2, 1.1, 3.2, 12.8],
            },
          },
        },
        behavior: null,
      },
      dry: {
        children: {
          mtn: {
            children: null,
            behavior: {
              _id: "camper__dry__mtn",
              n: 26,
              hierarchy: ["camper", "dry", "mtn"],
              distances: [0.6, 1.6, 4.2, 32.5],
            },
          },
        },
        behavior: null,
      },
    },
    behavior: null,
  },
  caver: {
    children: {
      temperate: {
        children: null,
        behavior: {
          _id: "caver__temperate",
          n: 7,
          hierarchy: ["caver", "temperate"],
          distances: [0, 0.1, 0, 0],
        },
      },
    },
    behavior: null,
  },
  child1to3: {
    children: {
      temperate: {
        children: {
          mtn: {
            children: null,
            behavior: {
              _id: "child1to3__temperate__mtn",
              n: 58,
              hierarchy: ["child1to3", "temperate", "mtn"],
              distances: [0.2, 0.3, 0.6, 4.5],
            },
          },
          flat: {
            children: null,
            behavior: {
              _id: "child1to3__temperate__flat",
              n: 61,
              hierarchy: ["child1to3", "temperate", "flat"],
              distances: [0.2, 0.3, 1, 3.2],
            },
          },
          dispersion: {
            children: null,
            behavior: {
              _id: "child1to3__temperate__dispersion",
              n: 36,
              hierarchy: ["child1to3", "temperate", "dispersion"],
              distances: [0, 23, 66, 137],
            },
          },
        },
        behavior: null,
      },
      dry: {
        children: null,
        behavior: {
          _id: "child1to3__dry",
          n: 13,
          hierarchy: ["child1to3", "dry"],
          distances: [0.6, 1.3, 3.9, 9],
        },
      },
      urban: {
        children: null,
        behavior: {
          _id: "child1to3__urban",
          n: 17,
          hierarchy: ["child1to3", "urban"],
          distances: [0.1, 0.3, 0.5, 0.7],
        },
      },
    },
    behavior: null,
  },
  child4to6: {
    children: {
      temperate: {
        children: {
          mtn: {
            children: null,
            behavior: {
              _id: "child4to6__temperate__mtn",
              n: 38,
              hierarchy: ["child4to6", "temperate", "mtn"],
              distances: [0.2, 0.8, 1.5, 3.7],
            },
          },
          flat: {
            children: null,
            behavior: {
              _id: "child4to6__temperate__flat",
              n: 90,
              hierarchy: ["child4to6", "temperate", "flat"],
              distances: [0.2, 0.6, 1.5, 6.6],
            },
          },
          dispersion: {
            children: null,
            behavior: {
              _id: "child4to6__temperate__dispersion",
              n: 36,
              hierarchy: ["child4to6", "temperate", "dispersion"],
              distances: [0, 23, 66, 137],
            },
          },
        },
        behavior: null,
      },
      dry: {
        children: null,
        behavior: {
          _id: "child4to6__dry",
          n: 19,
          hierarchy: ["child4to6", "dry"],
          distances: [0.6, 1.9, 3.2, 8.2],
        },
      },
      urban: {
        children: null,
        behavior: {
          _id: "child4to6__urban",
          n: 25,
          hierarchy: ["child4to6", "urban"],
          distances: [0.1, 0.5, 1, 3.4],
        },
      },
    },
    behavior: null,
  },
  child7to9: {
    children: {
      temperate: {
        children: {
          mtn: {
            children: null,
            behavior: {
              _id: "child7to9__temperate__mtn",
              n: 38,
              hierarchy: ["child7to9", "temperate", "mtn"],
              distances: [0.8, 1.6, 3.2, 11.3],
            },
          },
          flat: {
            children: null,
            behavior: {
              _id: "child7to9__temperate__flat",
              n: 79,
              hierarchy: ["child7to9", "temperate", "flat"],
              distances: [0.2, 0.8, 2, 8],
            },
          },
          dispersion: {
            children: null,
            behavior: {
              _id: "child7to9__temperate__dispersion",
              n: 28,
              hierarchy: ["child7to9", "temperate", "dispersion"],
              distances: [21, 40, 57, 146],
            },
          },
        },
        behavior: null,
      },
      dry: {
        children: {
          mtn: {
            children: null,
            behavior: {
              _id: "child7to9__dry__mtn",
              n: 18,
              hierarchy: ["child7to9", "dry", "mtn"],
              distances: [0.4, 1.2, 3.2, 7.2],
            },
          },
        },
        behavior: null,
      },
      urban: {
        children: null,
        behavior: {
          _id: "child7to9__urban",
          n: 22,
          hierarchy: ["child7to9", "urban"],
          distances: [0.2, 0.5, 1.5, 5.2],
        },
      },
    },
    behavior: null,
  },
  child10to12: {
    children: {
      temperate: {
        children: {
          mtn: {
            children: null,
            behavior: {
              _id: "child10to12__temperate__mtn",
              n: 72,
              hierarchy: ["child10to12", "temperate", "mtn"],
              distances: [0.8, 1.6, 3.2, 9],
            },
          },
          flat: {
            children: null,
            behavior: {
              _id: "child10to12__temperate__flat",
              n: 57,
              hierarchy: ["child10to12", "temperate", "flat"],
              distances: [0.4, 1.6, 4.8, 10],
            },
          },
          dispersion: {
            children: null,
            behavior: {
              _id: "child10to12__temperate__dispersion",
              n: 28,
              hierarchy: ["child10to12", "temperate", "dispersion"],
              distances: [21, 40, 57, 146],
            },
          },
        },
        behavior: null,
      },
      dry: {
        children: {
          mtn: {
            children: null,
            behavior: {
              _id: "child10to12__dry__mtn",
              n: 22,
              hierarchy: ["child10to12", "dry", "mtn"],
              distances: [0.8, 2, 7.2, 16.1],
            },
          },
          flat: {
            children: null,
            behavior: {
              _id: "child10to12__dry__flat",
              n: 7,
              hierarchy: ["child10to12", "dry", "flat"],
              distances: [0, 0, 3.2, 0],
            },
          },
        },
        behavior: null,
      },
      urban: {
        children: null,
        behavior: {
          _id: "child10to12__urban",
          n: 18,
          hierarchy: ["child10to12", "urban"],
          distances: [0.3, 1.5, 2.9, 5.8],
        },
      },
    },
    behavior: null,
  },
  child13to15: {
    children: {
      temperate: {
        children: {
          mtn: {
            children: null,
            behavior: {
              _id: "child13to15__temperate__mtn",
              n: 74,
              hierarchy: ["child13to15", "temperate", "mtn"],
              distances: [0.8, 2.1, 4.8, 21.4],
            },
          },
          flat: {
            children: null,
            behavior: {
              _id: "child13to15__temperate__flat",
              n: 80,
              hierarchy: ["child13to15", "temperate", "flat"],
              distances: [0.6, 1.3, 3.2, 10],
            },
          },
          dispersion: {
            children: null,
            behavior: {
              _id: "child13to15__temperate__dispersion",
              n: 9,
              hierarchy: ["child13to15", "temperate", "dispersion"],
              distances: [0, 6, 48, 139],
            },
          },
        },
        behavior: null,
      },
      dry: {
        children: {
          mtn: {
            children: null,
            behavior: {
              _id: "child13to15__dry__mtn",
              n: 19,
              hierarchy: ["child13to15", "dry", "mtn"],
              distances: [2.4, 3.2, 4.8, 11.9],
            },
          },
        },
        behavior: null,
      },
    },
    behavior: null,
  },
  climber: {
    children: {
      temperate: {
        children: null,
        behavior: {
          _id: "climber__temperate",
          n: 25,
          hierarchy: ["climber", "temperate"],
          distances: [0.2, 1.6, 3.2, 14.7],
          dispersion: {
            n: 6,
            p25: 5,
            p50: 28,
            p75: 50,
            p95: 146,
          },
        },
      },
      dry: {
        children: null,
        behavior: {
          _id: "climber__dry",
          n: 7,
          hierarchy: ["climber", "dry"],
          distances: [0, 4.8, 0, 0],
        },
      },
    },
    behavior: null,
  },
  dementia: {
    children: {
      temperate: {
        children: {
          mtn: {
            children: null,
            behavior: {
              _id: "dementia__temperate__mtn",
              n: 95,
              hierarchy: ["dementia", "temperate", "mtn"],
              distances: [0.3, 0.8, 1.9, 8.3],
            },
          },
          flat: {
            children: null,
            behavior: {
              _id: "dementia__temperate__flat",
              n: 175,
              hierarchy: ["dementia", "temperate", "flat"],
              distances: [0.3, 0.8, 2.4, 12.8],
            },
          },
          dispersion: {
            children: null,
            behavior: {
              _id: "dementia__temperate__dispersion",
              n: 11,
              hierarchy: ["dementia", "temperate", "dispersion"],
              distances: [11, 23, 66, 70],
            },
          },
        },
        behavior: null,
      },
      dry: {
        children: {
          mtn: {
            children: null,
            behavior: {
              _id: "dementia__dry__mtn",
              n: 14,
              hierarchy: ["dementia", "dry", "mtn"],
              distances: [1, 1.9, 3.1, 6.1],
            },
          },
          flat: {
            children: null,
            behavior: {
              _id: "dementia__dry__flat",
              n: 15,
              hierarchy: ["dementia", "dry", "flat"],
              distances: [0.5, 1.6, 3.6, 11.8],
            },
          },
        },
        behavior: null,
      },
      urban: {
        children: null,
        behavior: {
          _id: "dementia__urban",
          n: 336,
          hierarchy: ["dementia", "urban"],
          distances: [0.3, 1.1, 3.2, 12.6],
        },
      },
    },
    behavior: null,
  },
  despondent: {
    children: {
      temperate: {
        children: {
          mtn: {
            children: null,
            behavior: {
              _id: "despondent__temperate__mtn",
              n: 103,
              hierarchy: ["despondent", "temperate", "mtn"],
              distances: [0.3, 1.1, 3.2, 21.6],
            },
          },
          flat: {
            children: null,
            behavior: {
              _id: "despondent__temperate__flat",
              n: 193,
              hierarchy: ["despondent", "temperate", "flat"],
              distances: [0.3, 0.8, 2.3, 17.3],
            },
          },
          dispersion: {
            children: null,
            behavior: {
              _id: "despondent__temperate__dispersion",
              n: 6,
              hierarchy: ["despondent", "temperate", "dispersion"],
              distances: [0, 0, 3, 30],
            },
          },
        },
        behavior: null,
      },
      dry: {
        children: {
          mtn: {
            children: null,
            behavior: {
              _id: "despondent__dry__mtn",
              n: 20,
              hierarchy: ["despondent", "dry", "mtn"],
              distances: [0.8, 1.6, 3.4, 18],
            },
          },
          flat: {
            children: null,
            behavior: {
              _id: "despondent__dry__flat",
              n: 14,
              hierarchy: ["despondent", "dry", "flat"],
              distances: [0.5, 1.9, 3.7, 20.7],
            },
          },
        },
        behavior: null,
      },
      urban: {
        children: null,
        behavior: {
          _id: "despondent__urban",
          n: 96,
          hierarchy: ["despondent", "urban"],
          distances: [0.1, 0.5, 1.5, 13.1],
        },
      },
    },
    behavior: null,
  },
  gatherer: {
    children: {
      temperate: {
        children: {
          mtn: {
            children: null,
            behavior: {
              _id: "gatherer__temperate__mtn",
              n: 94,
              hierarchy: ["gatherer", "temperate", "mtn"],
              distances: [1.5, 3.2, 6.4, 12.9],
            },
          },
        },
        behavior: null,
      },
      dry: {
        children: null,
        behavior: {
          _id: "gatherer__dry",
          n: 14,
          hierarchy: ["gatherer", "dry"],
          distances: [1.6, 2.6, 5.8, 11.1],
        },
      },
    },
    behavior: null,
  },
  hiker: {
    children: {
      temperate: {
        children: {
          mtn: {
            children: null,
            behavior: {
              _id: "hiker__temperate__mtn",
              n: 568,
              hierarchy: ["hiker", "temperate", "mtn"],
              distances: [1.1, 3.1, 5.8, 18.3],
            },
          },
          flat: {
            children: null,
            behavior: {
              _id: "hiker__temperate__flat",
              n: 274,
              hierarchy: ["hiker", "temperate", "flat"],
              distances: [0.6, 1.8, 3.2, 9.9],
            },
          },
          dispersion: {
            children: null,
            behavior: {
              _id: "hiker__temperate__dispersion",
              n: 134,
              hierarchy: ["hiker", "temperate", "dispersion"],
              distances: [2, 23, 64, 132],
            },
          },
        },
        behavior: null,
      },
      dry: {
        children: {
          mtn: {
            children: null,
            behavior: {
              _id: "hiker__dry__mtn",
              n: 221,
              hierarchy: ["hiker", "dry", "mtn"],
              distances: [1.6, 3.2, 6.5, 19.3],
            },
          },
          flat: {
            children: null,
            behavior: {
              _id: "hiker__dry__flat",
              n: 58,
              hierarchy: ["hiker", "dry", "flat"],
              distances: [1.3, 2.1, 6.6, 13.1],
            },
          },
          dispersion: {
            children: null,
            behavior: {
              _id: "hiker__dry__dispersion",
              n: 28,
              hierarchy: ["hiker", "dry", "dispersion"],
              distances: [20, 47, 124, 175],
            },
          },
        },
        behavior: null,
      },
      urban: {
        children: null,
        behavior: {
          _id: "hiker__urban",
          n: 8,
          hierarchy: ["hiker", "urban"],
          distances: [0, 2.6, 0, 0],
        },
      },
    },
    behavior: null,
  },
  horsebackrider: {
    children: null,
    behavior: {
      _id: "horsebackrider",
      n: 17,
      hierarchy: ["horsebackrider"],
      distances: [0.3, 3.2, 8.1, 19.8],
    },
  },
  hunter: {
    children: {
      temperate: {
        children: {
          mtn: {
            children: null,
            behavior: {
              _id: "hunter__temperate__mtn",
              n: 355,
              hierarchy: ["hunter", "temperate", "mtn"],
              distances: [1, 2.1, 4.8, 17.2],
            },
          },
          flat: {
            children: null,
            behavior: {
              _id: "hunter__temperate__flat",
              n: 465,
              hierarchy: ["hunter", "temperate", "flat"],
              distances: [0.6, 1.6, 3.1, 13.7],
            },
          },
          dispersion: {
            children: null,
            behavior: {
              _id: "hunter__temperate__dispersion",
              n: 196,
              hierarchy: ["hunter", "temperate", "dispersion"],
              distances: [12, 45, 90, 156],
            },
          },
        },
        behavior: null,
      },
      dry: {
        children: {
          mtn: {
            children: null,
            behavior: {
              _id: "hunter__dry__mtn",
              n: 138,
              hierarchy: ["hunter", "dry", "mtn"],
              distances: [2.1, 4.8, 8.1, 22.2],
            },
          },
          flat: {
            children: null,
            behavior: {
              _id: "hunter__dry__flat",
              n: 40,
              hierarchy: ["hunter", "dry", "flat"],
              distances: [1.6, 3.1, 6.4, 11.3],
            },
          },
        },
        behavior: null,
      },
    },
    behavior: null,
  },
  mentalillness: {
    children: {
      temperate: {
        children: {
          mtn: {
            children: null,
            behavior: {
              _id: "mentalillness__temperate__mtn",
              n: 23,
              hierarchy: ["mentalillness", "temperate", "mtn"],
              distances: [0.6, 2.3, 8.3, 14.6],
            },
          },
          flat: {
            children: null,
            behavior: {
              _id: "mentalillness__temperate__flat",
              n: 23,
              hierarchy: ["mentalillness", "temperate", "flat"],
              distances: [0.8, 1, 2.3, 8.1],
            },
          },
        },
        behavior: null,
      },
      dry: {
        children: {
          mtn: {
            children: null,
            behavior: {
              _id: "mentalillness__dry__mtn",
              n: 32,
              hierarchy: ["mentalillness", "dry", "mtn"],
              distances: [1.7, 4, 8.2, 18.1],
            },
          },
        },
        behavior: null,
      },
      urban: {
        children: null,
        behavior: {
          _id: "mentalillness__urban",
          n: 38,
          hierarchy: ["mentalillness", "urban"],
          distances: [0.3, 0.6, 1.5, 12.5],
        },
      },
    },
    behavior: null,
  },
  mentaldisability: {
    children: {
      temperate: {
        children: {
          mtn: {
            children: null,
            behavior: {
              _id: "mentaldisability__temperate__mtn",
              n: 31,
              hierarchy: ["mentaldisability", "temperate", "mtn"],
              distances: [0.6, 1.6, 3.2, 11.3],
            },
          },
          flat: {
            children: null,
            behavior: {
              _id: "mentaldisability__temperate__flat",
              n: 36,
              hierarchy: ["mentaldisability", "temperate", "flat"],
              distances: [0.3, 1, 2.1, 11.8],
            },
          },
        },
        behavior: null,
      },
      dry: {
        children: null,
        behavior: {
          _id: "mentaldisability__dry",
          n: 21,
          hierarchy: ["mentaldisability", "dry"],
          distances: [1.1, 4, 8.7, 62.6],
        },
      },
      urban: {
        children: null,
        behavior: {
          _id: "mentaldisability__urban",
          n: 44,
          hierarchy: ["mentaldisability", "urban"],
          distances: [0.3, 0.8, 3.7, 9.9],
        },
      },
    },
    behavior: null,
  },
  mountainbiker: {
    children: {
      temperate: {
        children: {
          mtn: {
            children: null,
            behavior: {
              _id: "mountainbiker__temperate__mtn",
              n: 25,
              hierarchy: ["mountainbiker", "temperate", "mtn"],
              distances: [3.1, 4, 11.3, 25],
            },
          },
        },
        behavior: null,
      },
      dry: {
        children: null,
        behavior: {
          _id: "mountainbiker__dry",
          n: 21,
          hierarchy: ["mountainbiker", "dry"],
          distances: [1.1, 4, 8.7, 62.6],
          dispersion: {
            n: 28,
            p25: 21,
            p50: 40,
            p75: 57,
            p95: 146,
          },
        },
      },
      urban: {
        children: null,
        behavior: {
          _id: "mountainbiker__urban",
          n: 44,
          hierarchy: ["mountainbiker", "urban"],
          distances: [0.3, 0.8, 3.7, 9.9],
        },
      },
    },
    behavior: null,
  },
  runner: {
    children: {
      temperate: {
        children: null,
        behavior: {
          _id: "runner__temperate",
          n: 14,
          hierarchy: ["runner", "temperate"],
          distances: [1.4, 2.6, 3.4, 5.8],
        },
      },
    },
    behavior: null,
  },
  skieralpine: {
    children: {
      temperate: {
        children: {
          mtn: {
            children: null,
            behavior: {
              _id: "skieralpine__temperate__mtn",
              n: 16,
              hierarchy: ["skieralpine", "temperate", "mtn"],
              distances: [1.1, 2.7, 4.8, 15.2],
            },
          },
        },
        behavior: null,
      },
      dry: {
        children: null,
        behavior: {
          _id: "skieralpine__dry",
          n: 8,
          hierarchy: ["skieralpine", "dry"],
          distances: [0, 4.8, 0, 0],
        },
      },
    },
    behavior: null,
  },
  skiernordic: {
    children: {
      temperate: {
        children: {
          mtn: {
            children: null,
            behavior: {
              _id: "skiernordic__temperate__mtn",
              n: 29,
              hierarchy: ["skiernordic", "temperate", "mtn"],
              distances: [1.6, 3.5, 6.4, 19.6],
            },
          },
          flat: {
            children: null,
            behavior: {
              _id: "skiernordic__temperate__flat",
              n: 0,
              hierarchy: ["skiernordic", "temperate", "flat"],
              distances: [0, 0, 0, 0],
            },
          },
        },
        behavior: null,
      },
      dry: {
        children: {
          mtn: {
            children: null,
            behavior: {
              _id: "skiernordic__dry__mtn",
              n: 41,
              hierarchy: ["skiernordic", "dry", "mtn"],
              distances: [1.9, 4.3, 6.4, 19.5],
            },
          },
          dispersion: {
            children: null,
            behavior: {
              _id: "skiernordic__dry__dispersion",
              n: 22,
              hierarchy: ["skiernordic", "dry", "dispersion"],
              distances: [16, 48, 149, 165],
            },
          },
        },
        behavior: null,
      },
    },
    behavior: null,
  },
  snowboarder: {
    children: {
      temperate: {
        children: {
          mtn: {
            children: null,
            behavior: {
              _id: "snowboarder__temperate__mtn",
              n: 31,
              hierarchy: ["snowboarder", "temperate", "mtn"],
              distances: [1.6, 3.2, 6.2, 15.4],
            },
          },
        },
        behavior: null,
      },
    },
    behavior: null,
  },
  snowmobiler: {
    children: {
      temperate: {
        children: {
          mtn: {
            children: null,
            behavior: {
              _id: "snowmobiler__temperate__mtn",
              n: 26,
              hierarchy: ["snowmobiler", "temperate", "mtn"],
              distances: [3.2, 6.4, 11.1, 16.1],
            },
          },
          flat: {
            children: null,
            behavior: {
              _id: "snowmobiler__temperate__flat",
              n: 14,
              hierarchy: ["snowmobiler", "temperate", "flat"],
              distances: [0.8, 2.9, 25.5, 59.7],
            },
          },
          dispersion: {
            children: null,
            behavior: {
              _id: "snowmobiler__temperate__dispersion",
              n: 11,
              hierarchy: ["snowmobiler", "temperate", "dispersion"],
              distances: [7, 11, 58, 169],
            },
          },
        },
        behavior: null,
      },
      dry: {
        children: {
          mtn: {
            children: null,
            behavior: {
              _id: "snowmobiler__dry__mtn",
              n: 22,
              hierarchy: ["snowmobiler", "dry", "mtn"],
              distances: [1, 3, 8.7, 18.9],
            },
          },
        },
        behavior: null,
      },
    },
    behavior: null,
  },
  snowshoer: {
    children: null,
    behavior: {
      _id: "snowshoer",
      n: 7,
      hierarchy: ["snowshoer"],
      distances: [0, 1, 0, 3],
    },
  },
  substanceabuse: {
    children: {
      temperate: {
        children: null,
        behavior: {
          _id: "substanceabuse__temperate",
          n: 15,
          hierarchy: ["substanceabuse", "temperate"],
          distances: [0.3, 0.7, 2.6, 6],
        },
      },
      urban: {
        children: null,
        behavior: {
          _id: "substanceabuse__urban",
          n: 6,
          hierarchy: ["substanceabuse", "urban"],
          distances: [0, 1.2, 0, 0],
        },
      },
    },
    behavior: null,
  },
  vehicle: {
    children: null,
    behavior: {
      _id: "vehicle",
      n: 84,
      hierarchy: ["vehicle"],
      distances: [2, 5, 12, 62.67],
    },
  },
  fourwd: {
    children: null,
    behavior: {
      _id: "fourwd",
      n: 19,
      hierarchy: ["fourwd"],
      distances: [0, 3.3, 6.4, 11.6],
    },
  },
  abandonedvehicle: {
    children: null,
    behavior: {
      _id: "abandonedvehicle",
      n: 11,
      hierarchy: ["abandonedvehicle"],
      distances: [0.6, 2, 4.4, 9.1],
    },
  },
  worker: {
    children: {
      temperate: {
        children: {
          mtn: {
            children: null,
            behavior: {
              _id: "worker__temperate__mtn",
              n: 29,
              hierarchy: ["worker", "temperate", "mtn"],
              distances: [1, 1.9, 3.2, 11.8],
            },
          },
          flat: {
            children: null,
            behavior: {
              _id: "worker__temperate__flat",
              n: 11,
              hierarchy: ["worker", "temperate", "flat"],
              distances: [0, 0.4, 0, 0],
            },
          },
        },
        behavior: null,
      },
    },
    behavior: null,
  },
};
