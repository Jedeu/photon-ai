
//////////////////////////////////////////////////////////
// sample data objects for testing, can delete when deploy

var sampleUserObjExt = {
  id: 14,
  name: 'Laurel',
  photos: [
    // {
    //   "id":261,"url":"https://images.unsplash.com/photo-1431051047106-f1e17d81042f","tags":[{"name":"water","type":"label"},{"name":"nature","type":"label"},{"name":"grass","type":"label"},{"name":"arthropod","type":"label"},{"name":"green","type":"label"},{"name":"morning","type":"label"}]
    // },{
    //   "id":8,"url":"https://images.unsplash.com/photo-1422157245273-e08b638b4b00","tags":[{"name":"city","type":"label"},{"name":"street","type":"label"},{"name":"alley","type":"label"},{"name":"urban area","type":"label"},{"name":"road","type":"label"},{"name":"town","type":"label"},{"name":"landform","type":"label"},{"name":"lane","type":"label"},{"name":"neighbourhood","type":"label"}]
    // },{
    //   "id":61,"url":"https://images.unsplash.com/photo-1442589031151-61d5645469d7","tags":[]
    // },{
    //   "id":75,"url":"https://images.unsplash.com/photo-1433769778268-24b797c4fc9a","tags":[{"name":"architecture","type":"label"}]
    // },{
    //   "id":278,"url":"https://images.unsplash.com/photo-1424746219973-8fe3bd07d8e3","tags":[{"name":"tree","type":"label"},{"name":"forest","type":"label"},{"name":"road","type":"label"},{"name":"asphalt","type":"label"}]
    // },
    {
      "id":252,"width":4592,"height":3448,"url":"https://images.unsplash.com/photo-1434077471918-4ea96e6e45d5","tags":[{"name":"sky","type":"label"},{"name":"cloud","type":"label"}]
    },
    // {
    //   "id":166,"url":"https://images.unsplash.com/photo-1441448770220-76743f9e6af6","tags":[{"name":"structure","type":"label"},{"name":"plumbing fixture","type":"label"}]
    // },{
    //   "id":269,"url":"https://images.unsplash.com/photo-1429198739803-7db875882052","tags":[{"name":"color","type":"label"},{"name":"yellow","type":"label"},{"name":"tree","type":"label"},{"name":"leaf","type":"label"},{"name":"autumn","type":"label"},{"name":"orange","type":"label"}]
    // },{
    //   "id":277,"url":"https://images.unsplash.com/photo-1428263197823-ce6a8620d1e1","tags":[]
    // },{
    //   "id":79,"url":"https://images.unsplash.com/photo-1450849608880-6f787542c88a","tags":[]
    // },{
    //   "id":230,"url":"https://images.unsplash.com/photo-1425315283416-2acc50323ee6","tags":[{"name":"sea","type":"label"},{"name":"ocean","type":"label"},{"name":"vacation","type":"label"},{"name":"sky","type":"label"},{"name":"photograph","type":"label"}]
    // },{
    //   "id":273,"url":"https://images.unsplash.com/photo-1429042007245-890c9e2603af","tags":[{"name":"landform","type":"label"},{"name":"mountain","type":"label"},{"name":"road","type":"label"},{"name":"highway","type":"label"},{"name":"mountain pass","type":"label"}]
    // },{
    //   "id":156,"url":"https://images.unsplash.com/photo-1442188950719-e8a67aea613a","tags":[]
    // },{
    //   "id":256,"url":"https://images.unsplash.com/photo-1429308755210-25a272addeb3","tags":[{"name":"plant","type":"label"},{"name":"nature","type":"label"},{"name":"flora","type":"label"},{"name":"yellow","type":"label"},{"name":"flower","type":"label"},{"name":"close up","type":"label"},{"name":"flowering plant","type":"label"}]
    // }
  ]
};

var sampleUserObj = {
  id: 9,
  name: 'Jason',
  photos: [
    {
      id: 22,
      url: 'images/22.jpg',
      width: 1080,
      height: 1080,
      tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6']
    },
    {
      id: 26,
      url: 'images/26.jpg',
      width: 1080,
      height: 717,
      tags: ['tag1', 'tag2', 'tag4', 'tag6']
    },
    {
      id: 20,
      url: 'images/20.jpg',
      width: 1080,
      height: 1080,
      tags: ['tag1', 'tag3', 'tag4', 'tag6']
    },
    {
      id: 36,
      url: 'images/36.jpg',
      width: 720,
      height: 1080,
      tags: ['tag2', 'tag4', 'tag5']
    },
    {
      id: 39,
      url: 'images/39.jpg',
      width: 1080,
      height: 720,
      tags: ['tag1', 'tag5', 'tag6']
    },
    {
      id: 18,
      url: 'images/18.jpg',
      width: 1080,
      height: 720,
      tags: ['tag5', 'tag6']
    },
    {
      id: 9,
      url: 'images/9.jpg',
      width: 1080,
      height: 720,
      tags: ['tag1', 'tag2', 'tag5', 'tag6']
    },
    {
      id: 35,
      url: 'images/35.jpg',
      width: 1080,
      height: 1080,
      tags: ['tag1', 'tag2']
    },
    {
      id: 33,
      url: 'images/33.jpg',
      width: 950,
      height: 650,
      tags: ['tag1', 'tag2', 'tag6']
    },
  {
    id: 24,
    url: 'images/24.jpg',
    width: 1080,
    height: 654,
    tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6']
  }
  ],
  recommendedPhotos: [
  {
    id: 36,
    url: 'images/36.jpg',
    width: 720,
    height: 1080,
    tags: ['tag2', 'tag4', 'tag5']
  },
  {
    id: 39,
    url: 'images/39.jpg',
    width: 1080,
    height: 720,
    tags: ['tag1', 'tag5', 'tag6']
  }
  ],
};

var samplePhotoObj1 = {
  "id": 6,
  "url": "https://images.unsplash.com/photo-1432383079404-c66efb4828a3",
  "tags": [{"name":"sea","type":"label"},{"name":"coast","type":"label"},{"name":"water","type":"label"},{"name":"ocean","type":"label"},{"name":"shore","type":"label"},{"name":"reflection","type":"label"},{"name":"stack","type":"label"}]
};

var samplePhotoObj2 = {
  id: 0,
  url: 'images/24.jpg',
  width: 1080,
  height: 654,
  tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6']
};

var samplePhotoObjExt = {
  id: 456,
  url: 'https://images.unsplash.com/photo-1449177009399-be6867ef0505',
  smallURL: 'http://104.131.96.71/unsafe/fit-in/800x4000/images.unsplash.com/photo-1449177009399-be6867ef0505',
  width: 5616,
  height: 3744,
  tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6']
};

var samplePhotoObjExtNoWidth = {
  id: 756,
  url: 'https://images.unsplash.com/photo-1449177009399-be6867ef0505',
  tags: ['tag1', 'tag3', 'tag5']
};

var samplePhotosObj = {
  photos: [
    {
      id: 22,
      url: 'images/22.jpg',
      width: 1080,
      height: 1080,
      tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6']
    },
    {
      id: 26,
      url: 'images/26.jpg',
      width: 1080,
      height: 717,
      tags: ['tag1', 'tag2', 'tag4', 'tag6']
    },
    {
      id: 20,
      url: 'images/20.jpg',
      width: 1080,
      height: 1080,
      tags: ['tag1', 'tag3', 'tag4', 'tag6']
    },
    {
      id: 36,
      url: 'images/36.jpg',
      width: 720,
      height: 1080,
      tags: ['tag2', 'tag4', 'tag5']
    },
    {
      id: 39,
      url: 'images/39.jpg',
      width: 1080,
      height: 720,
      tags: ['tag1', 'tag5', 'tag6']
    },
    {
      id: 18,
      url: 'images/18.jpg',
      width: 1080,
      height: 720,
      tags: ['tag5', 'tag6']
    },
    {
      id: 9,
      url: 'images/9.jpg',
      width: 1080,
      height: 720,
      tags: ['tag1', 'tag2', 'tag5', 'tag6']
    },
    {
      id: 35,
      url: 'images/35.jpg',
      width: 1080,
      height: 1080,
      tags: ['tag1', 'tag2']
    },
    {
      id: 33,
      url: 'images/33.jpg',
      width: 950,
      height: 650,
      tags: ['tag1', 'tag2', 'tag6']
    },
    {
      id: 31,
      url: 'images/31.jpg',
      width: 280,
      height: 280,
      tags: ['tag1', 'tag2', 'tag3', 'tag4']
    },
    {
      url: 'images/24.jpg',
      width: 1080,
      height: 654,
      tags: ['tag1', 'tag4', 'tag5', 'tag6']
    },
    {
      url: 'images/2.jpg',
      width: 1080,
      height: 391,
      tags: ['tag1', 'tag2', 'tag3', 'tag4']
    },
    {
      url: 'images/21.jpg',
      width: 1080,
      height: 608,
      tags: ['tag1', 'tag4', 'tag5', 'tag6']
    },
    {
      url: 'images/4.jpg',
      width: 1080,
      height: 720,
      tags: ['tag1', 'tag2', 'tag3']
    },
    {
      url: 'images/17.jpg',
      width: 1080,
      height: 720,
      tags: ['tag2', 'tag5', 'tag6']
    },
    {
      url: 'images/12.jpg',
      width: 1080,
      height: 720,
      tags: ['tag3', 'tag4']
    },
    {
      url: 'images/19.jpg',
      width: 1080,
      height: 719,
      tags: ['tag1', 'tag3', 'tag6']
    },
    {
      url: 'images/15.jpg',
      width: 1080,
      height: 683,
      tags: ['tag1', 'tag3', 'tag4', 'tag5']
    },
    {
      url: 'images/32.jpg',
      width: 1080,
      height: 721,
      tags: ['tag1', 'tag2', 'tag5', 'tag6']
    },
    {
      url: 'images/28.jpg',
      width: 1080,
      height: 705,
      tags: ['tag1', 'tag3', 'tag6']
    }
  ]
};
