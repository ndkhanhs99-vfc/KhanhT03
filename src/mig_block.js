  /* Chạy 1 lần: bù các dòng Kế hoạch (file KHDS) và Thực hiện (nhập trên trang Claude) còn thiếu trên Firebase */
  (async function () {
    try {
      var meta = DB.collection("meta").doc("seed"), m = await meta.get(), md = (m.exists && m.data()) || {};
      async function fill(name, seed) {
        var have = {}; (await DB.collection(name).get()).docs.forEach(function (d) { have[d.id] = 1; });
        await Promise.all(Object.keys(seed).filter(function (id) { return !have[id]; }).map(function (id) { return DB.collection(name).doc(id).set(seed[id]); }));
      }
      if (!md.kh2) { await fill("kh", KH_SEED); await meta.set({ kh2: true }, { merge: true }); }
      if (!md.th) { await fill("th", TH_SEED); await meta.set({ th: true }, { merge: true }); }
    } catch (e) {}
  })();
