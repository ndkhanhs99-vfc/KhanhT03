  /* Chạy 1 lần: bù các dòng Kế hoạch (file KHDS) và Thực hiện (nhập trên trang Claude) còn thiếu trên Firebase */
  (async function () {
    try {
      var meta = DB.collection("meta").doc("seed"), m = await meta.get(), md = (m.exists && m.data()) || {};
      async function fill(name, seed) {
        var have = {}; (await DB.collection(name).get()).docs.forEach(function (d) { have[d.id] = 1; });
        await Promise.all(Object.keys(seed).filter(function (id) { return !have[id]; }).map(function (id) { return DB.collection(name).doc(id).set(seed[id]); }));
      }
      if (!md.kh2) { await fill("kh", KH_SEED); await meta.set({ kh2: true }, { merge: true }); }
      if (!md.w4split) {
        /* Tuần 4 (đại lý Thứ 5, 6, 7): dời kế hoạch từ 29–31/10 về 22–24/10; dòng lẻ để phần nhiều ở lần ghé đầu. Bỏ qua dòng đã sửa tay. */
        for (var wi = 0; wi < W4SPLIT.length; wi++) {
          var w = W4SPLIT[wi], oldRef = DB.collection("kh").doc(w[0]), od = await oldRef.get();
          if (!od.exists || +od.data().thung !== w[1]) continue;
          var o = od.data(), newRef = DB.collection("kh").doc(w[2]), nd = await newRef.get();
          if (!nd.exists) await newRef.set({ date: w[2].slice(0, 4) + "-" + w[2].slice(4, 6) + "-" + w[2].slice(6, 8), khbl: o.khbl, sp: o.sp, thung: w[3], ts: o.ts || Date.now() });
          if (w[4] > 0) await oldRef.set(Object.assign({}, o, { thung: w[4] })); else await oldRef.delete();
        }
        await meta.set({ w4split: true }, { merge: true });
      }
      if (!md.th) { await fill("th", TH_SEED); await meta.set({ th: true }, { merge: true }); }
      if (!md.kq1012) {
        /* Kết quả sản phẩm lũy kế đến 12/10 anh Khánh đưa (lít/kg); bỏ qua ô anh đã tự nhập */
        var KQ = { amistar: "120", anvil: "144", incipio: "8", blastogan: "15", pexena: "2", ridomil: "20" };
        var rr = DB.collection("rp").doc("2026-10-12"), rd = await rr.get(), cur = (rd.exists && rd.data()) || {}, add = {};
        Object.keys(KQ).forEach(function (k) { var f = "p_" + k + "_k"; if (cur[f] === undefined || cur[f] === "") add[f] = KQ[k]; });
        if (Object.keys(add).length) await rr.set(add, { merge: true });
        await meta.set({ kq1012: true }, { merge: true });
      }
    } catch (e) {}
  })();
