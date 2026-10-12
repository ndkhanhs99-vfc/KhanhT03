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
    } catch (e) {}
  })();
