(() => {
  'use strict';
  const ROLES = [
    { id: "software", label: "Software Development" },
    { id: "data-ai", label: "Data · AI" },
    { id: "science", label: "Science · Research" },
    { id: "product", label: "Product · Planning" },
    { id: "design", label: "UX · Visual Design" },
    { id: "story", label: "Storytelling · Presentation" },
    { id: "business", label: "Business · Partnership" },
    { id: "other", label: "Other" }
  ];

  const CHALLENGE_GROUPS = [
    {
      id: "mission",
      title: "Moon, Mars & Mission Design",
      description: "달·화성 탐사와 미션 설계",
      challengeIds: ["clps-browser", "earth-analogs", "martian-map", "mission-design-game"]
    },
    {
      id: "earth",
      title: "Earth Observation & Change",
      description: "지구 관측 데이터와 변화 탐지",
      challengeIds: ["earth-trend", "dancing-sars", "fire-hotspots"]
    },
    {
      id: "climate",
      title: "Climate, Agriculture & Accessible Earth Data",
      description: "농업 회복력과 접근 가능한 지구 데이터",
      challengeIds: ["field-shift", "earth-jukebox"]
    },
    {
      id: "human",
      title: "Human Spaceflight, Health & Safety",
      description: "우주 생활·건강·안전",
      challengeIds: ["junior-astronaut", "astronaut-health", "flame-freefall"]
    },
    {
      id: "discovery",
      title: "Space Discovery & Storytelling",
      description: "우주 발견과 대중 스토리텔링",
      challengeIds: ["abandoned", "planet-x"]
    }
  ];

  const CHALLENGES = [
    { id: "abandoned", number: 1, title: "Abandoned but not Forgotten: Storytelling about NASA's Discarded Equipment on the Moon and Mars" },
    { id: "earth-trend", number: 2, title: "Be An Earth System Trend Detective!" },
    { id: "junior-astronaut", number: 3, title: "Build a Junior Astronaut Mission Trainer" },
    { id: "clps-browser", number: 4, title: "CLPS Lunar Mission Browser" },
    { id: "astronaut-health", number: 5, title: "Create Health Monitoring Software for Astronauts on Space Missions" },
    { id: "dancing-sars", number: 6, title: "Dancing with the SARs" },
    { id: "field-shift", number: 7, title: "Field Shift: Adapting Farms with NASA Data" },
    { id: "flame-freefall", number: 8, title: "Flame in Freefall: AI-Powered Fire Safety Insights from Microgravity Combustion Data" },
    { id: "fire-hotspots", number: 9, title: "Harmonization of MODIS and VIIRS Hot Spots" },
    { id: "earth-analogs", number: 10, title: "Identify Earth Locations that Analog the Permanent Moon Base Locations and Mars" },
    { id: "martian-map", number: 11, title: "Interplanetary Survival Guide: Martian Map" },
    { id: "planet-x", number: 12, title: "Planet X and SPHEREx" },
    { id: "mission-design-game", number: 13, title: "Space Mission Design Game" },
    { id: "earth-jukebox", number: 14, title: "The Earth Information Jukebox" }
  ];

  const createState = () => ({
    profile: {randomId:'',avatar:'',completed:false,currentRoles:[],desiredRoles:[],copy:'',emailOptIn:false,peerEmailOptIn:false,challenges:[],seekingStatus:'seeking'},
    ownerRoles:[],ownerTeam:null,requests:[],receivedInterests:[],ownerContacts:[]
  });
  window.SEOUL_HUB_CATALOG=Object.freeze({ROLES,CHALLENGE_GROUPS,CHALLENGES,createState});
})();
