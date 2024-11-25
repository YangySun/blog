var posts=["2024/11/12/使用Python提取城市路网/","2024/11/18/Parquet/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };