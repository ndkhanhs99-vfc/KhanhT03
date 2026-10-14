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
      if (!md.rp1012b) {
        /* Báo cáo ngày 12/10 theo bản anh Khánh đã chỉnh chuẩn (ảnh gửi 17:24) */
        await DB.collection("rp").doc("2026-10-12").set({"tg_sell": "95094532", "kq_sell": "42079136", "tg_lk": "2764290442", "kq_lk": "244845098", "tg_c2act": "32", "kq_c2act": "12", "tg_tt": "6", "kq_tt": "6", "tg_gd": "6", "kq_gd": "5", "tg_c2hd": "5", "kq_c2hd": "3", "tg_c2gd": "5", "kq_c2gd": "2", "tg_nd": "20", "kq_nd": "18", "tg_ndcd": "20", "kq_ndcd": "12", "p_amistar_t": "750", "p_amistar_k": "120", "p_amistar_nn": "Lúa còn nhỏ, xả đê nhiều", "p_amistar_gp": "Tận dụng chương trình đang có, tất niên để thúc hàng các C2 lớn", "p_pexena_t": "78", "p_pexena_k": "2", "p_pexena_nn": "Lúa mới hơn 20 ngày, chưa có dịch hại nên nông dân chưa có nhu cầu", "p_pexena_gp": "Tận dụng chương trình đang có, tất niên để thúc hàng các C2 lớn", "p_incipio_k": "12", "p_incipio_nn": "", "p_incipio_gp": "", "p_blastogan_t": "435", "p_blastogan_k": "15", "p_blastogan_nn": "Lúa 20 ngày nông dân chưa đầu tư hàng hiệu", "p_blastogan_gp": "Tận dụng chương trình đang có, tất niên để thúc hàng các C2 lớn", "p_anvil_t": "732", "p_anvil_k": "276", "p_anvil_nn": "Đang tận dụng các chương trình tháng, quý, tất niên", "p_anvil_gp": "Sẽ đạt trong tháng này", "p_ridomil_t": "370", "p_ridomil_k": "40", "p_ridomil_nn": "Lúa còn nhỏ, xả đê nhiều", "p_ridomil_gp": "Tận dụng chương trình đang có, tất niên để thúc hàng các C2 lớn", "p_michelle_k": "0", "p_michelle_nn": "", "p_michelle_gp": "", "p_xantocin_t": "10", "p_xantocin_k": "0", "p_xantocin_nn": "Lúa còn nhỏ, xả đê nhiều", "p_xantocin_gp": "Kết hợp MDO giới thiệu giải pháp, tăng nhận diện đến nông dân", "p_tora_t": "8", "p_tora_k": "0", "p_tora_nn": "Lúa còn nhỏ, xả đê nhiều", "p_tora_gp": "Kết hợp MDO giới thiệu giải pháp, tăng nhận diện đến nông dân", "p_delfan_t": "10", "p_delfan_k": "0", "p_delfan_nn": "Lúa còn nhỏ, xả đê nhiều", "p_delfan_gp": "Kết hợp MDO giới thiệu giải pháp, tăng nhận diện đến nông dân"}, { merge: true });
        await meta.set({ rp1012b: true }, { merge: true });
      }
      if (!md.rp1012c) {
        /* Xantocin, Tora, Delfan ngày 12/10: trả về như cũ (target theo file KHDS, kết quả tự động) */
        var r3 = DB.collection("rp").doc("2026-10-12"), d3 = await r3.get();
        if (d3.exists) { var o3 = Object.assign({}, d3.data()); ["xantocin", "tora", "delfan"].forEach(function (k) { ["t", "k", "nn", "gp"].forEach(function (f) { delete o3["p_" + k + "_" + f]; }); }); await r3.set(o3); }
        await meta.set({ rp1012c: true }, { merge: true });
      }
      if (!md.kh3) {
        /* Lên lại kế hoạch theo quy ước tuần mới: T2 12–18, T3 19–25, T4 26–31; mỗi tuần đặt vào ngày đi tuyến của đại lí (tuyến lấy cả phần anh đã đổi trên web).
           Dòng kế hoạch anh tự thêm/sửa (khác bản tự động cũ) được giữ nguyên. Ngày 8–11 (nay thuộc tuần 1) bỏ kế hoạch tuần 2 cũ, nhưng giữ target sell-out đã có trong báo cáo các ngày đó. */
        var rs3 = await DB.collection("route").get(), RT3 = {}; rs3.docs.forEach(function (d) { var x = d.data(); if (x && x.day) RT3[d.id] = x.day; });
        var RNG3 = { 2: [12, 18], 3: [19, 25], 4: [26, LAST] }, want3 = {}, now3 = Date.now();
        D.agents.forEach(function (a) {
          var rd = RT3[a.m] ? (RT3[a.m] === "none" ? "" : RT3[a.m]) : (a.d || ""); if (!rd) return;
          [2, 3, 4].forEach(function (w) {
            var dt = ""; for (var d = RNG3[w][0]; d <= RNG3[w][1]; d++) { var ds = MONTH + "-" + pad(d); if (keyOfDate(ds) === rd) { dt = ds; break; } }
            if (!dt) return;
            (PL[a.m] || []).forEach(function (l) { var q = l[4 + w]; if (q > 0) want3[docId(dt, a.m, l[1])] = { date: dt, khbl: a.m, sp: l[1], thung: q, ts: now3++ }; });
          });
        });
        var all3 = await DB.collection("kh").get(), auto3 = {}, man3 = {}, oldSell = {};
        all3.docs.forEach(function (d) {
          var x = d.data(); if (!x || !x.date || x.date < MONTH + "-08") return;
          var o = KH_OLD[d.id]; if (o && o.date === x.date && +o.thung === +x.thung) auto3[d.id] = x; else man3[d.id] = 1;
          if (x.date <= MONTH + "-11") oldSell[x.date] = (oldSell[x.date] || 0) + (+x.thung || 0) * priceOf(x.sp);
        });
        for (var od in oldSell) { var rr3 = DB.collection("rp").doc(od), rg3 = await rr3.get(), cd3 = (rg3.exists && rg3.data()) || {}; if (cd3.tg_sell === undefined || cd3.tg_sell === "") await rr3.set({ tg_sell: String(Math.round(oldSell[od])) }, { merge: true }); }
        var ops3 = [];
        Object.keys(auto3).forEach(function (id) { if (!want3[id]) ops3.push(DB.collection("kh").doc(id).delete()); });
        Object.keys(want3).forEach(function (id) { if (!man3[id]) ops3.push(DB.collection("kh").doc(id).set(want3[id])); });
        await Promise.all(ops3);
        await meta.set({ kh3: true }, { merge: true });
      }
      if (!md.kh4) {
        /* Kế hoạch tháng 10 theo file chuẩn "Ngày ghé 1 tháng 10" (sheet KH chi tiết) anh Khánh gửi 14/10: thay toàn bộ dòng tự động bằng đúng file.
           Dòng anh tự thêm (khác mọi bản tự động trước) được giữ, trừ khi trùng đại lí–sản phẩm–ngày với file thì lấy theo file. */
        var all4 = await DB.collection("kh").get(), ops4 = [], have4 = {};
        function wk4(ds) { var d = +ds.slice(8, 10); return d <= 11 ? 1 : d <= 18 ? 2 : d <= 25 ? 3 : 4; }
        all4.docs.forEach(function (d) {
          var x = d.data(); if (!x || !x.date) return; have4[d.id] = x;
          var o1 = KH_OLD[d.id], o2 = KH_PREV[d.id], auto = (o1 && +o1.thung === +x.thung) || (o2 && +o2.thung === +x.thung);
          if (!auto && x.date >= MONTH + "-12") { var l = (PL[x.khbl] || []).filter(function (z) { return z[1] === x.sp; })[0]; if (l && +l[4 + wk4(x.date)] === +x.thung) auto = true; }
          if (auto && !KH_SEED[d.id]) ops4.push(DB.collection("kh").doc(d.id).delete());
        });
        Object.keys(KH_SEED).forEach(function (id) { var x = have4[id]; if (!x || +x.thung !== +KH_SEED[id].thung || x.date !== KH_SEED[id].date) ops4.push(DB.collection("kh").doc(id).set(KH_SEED[id])); });
        await Promise.all(ops4);
        await meta.set({ kh4: true }, { merge: true });
      }
    } catch (e) {}
  })();
