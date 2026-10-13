"""Tạo index.html cho web (GitHub Pages) từ bản gốc src/app.html.
Thêm: dữ liệu khởi tạo (KH_SEED, TH_SEED), config.js (Firebase), màn hình mật khẩu, chuyển dữ liệu 1 lần."""
import json, os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def rd(p): return open(os.path.join(ROOT, p), encoding="utf8").read()
s = rd("src/app.html")
kh = json.loads(rd("src/kh_seed.json")); th = json.loads(rd("src/th_seed.json"))
w4 = json.loads(rd("src/w4split.json"))
def rep(old, new):
    global s
    assert s.count(old) == 1, old[:60]; s = s.replace(old, new)
rep('S.kh = lsGet("kh");',
    'var W4SPLIT = ' + json.dumps(w4, separators=(",", ":")) + ';\n'
    'var TH_SEED = ' + json.dumps(th, ensure_ascii=False, separators=(",", ":")) + ';\n'
    'var KH_SEED = ' + json.dumps(kh, ensure_ascii=False, separators=(",", ":")) + ';\n'
    'var KH_OLD = ' + rd("src/kh_old.json") + ';\n'
    'S.kh = lsGet("kh"); if (!window.claude && !Object.keys(S.kh).length) { try { if (!localStorage.getItem("sdsse_seeded")) { S.kh = KH_SEED; lsSet("kh", S.kh); localStorage.setItem("sdsse_seeded", "1"); } } catch (e) { S.kh = KH_SEED; } }')
rep('<script>\n(function () {', '<script src="config.js"></script>\n<script>\nwindow.__startApp = function () {')
i = s.rindex('})();\n</script>'); s = s[:i] + '};\n</script>\n' + rd("src/gate_block.html") + s[i + len('})();\n</script>'):]
m = re.search(r'<div class="banner">Chế độ xem này[^<]*</div>', s)
s = s.replace(m.group(0), '<div class="banner">Chưa nối được Firebase nên số đang lưu tạm trên máy này. Kiểm tra đã bật Firestore Database và còn trong thời hạn test mode chưa.</div>')
rep('  S.dbOk = true;\n', '  S.dbOk = true;\n' + rd("src/mig_block.js"))
import hashlib
ver = hashlib.sha1(s.encode("utf8")).hexdigest()[:10]
upd = ('<script>/* Tự cập nhật: nếu trên mạng đã có bản mới hơn bản đang mở (bộ nhớ đệm của điện thoại) thì tải lại 1 lần */\n'
       '(function () { var V = "' + ver + '"; try { fetch("version.txt?t=" + Date.now(), { cache: "no-store" }).then(function (r) { return r.ok ? r.text() : ""; }).then(function (t) { t = (t || "").trim();'
       ' if (t && t !== V) { var k = "sdsse_upd_" + t; if (!sessionStorage.getItem(k)) { sessionStorage.setItem(k, "1"); location.reload(); } } }).catch(function () {}); } catch (e) {} })();</script>\n')
s = s.replace('<script src="config.js"></script>', upd + '<script src="config.js"></script>', 1)
s = s.replace('<head>', '<head><meta http-equiv="Cache-Control" content="no-cache">', 1)
open(os.path.join(ROOT, "version.txt"), "w").write(ver + "\n")
open(os.path.join(ROOT, "index.html"), "w", encoding="utf8").write(s)
print("index.html", len(s))
