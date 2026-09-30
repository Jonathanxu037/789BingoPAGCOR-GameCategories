/* 789Bingo 管理后台 · PAGCOR 游戏分类需求原型（独立运行版） */
(function () {
  var html = htmPreact.html, render = htmPreact.render, Component = htmPreact.Component;

  // ---------- 规则与基础数据 ----------
  var VENDORS = { SLOT: { name: 'CQ9 Gaming', sort: '14' }, FC: { name: 'FC Gaming', sort: '28' }, WE: { name: 'WE Gaming', sort: '29' }, JILI: { name: 'JILI', sort: '—' } };
  var NG_LIST = [['440', 'BOXING EXTRAVAGANZA'], ['442', 'GO FOR CHAMPION'], ['241', 'KENO'], ['272', 'KENO BONUS NUMBER'], ['274', 'KENO EXTRA BET'], ['273', 'KENO SUPER CHANCE'], ['111', 'NUMBER KING']];
  var EB_LIST = [['177', 'BINGO ADVENTURE'], ['148', 'BINGO CARNAVAL'], ['149', 'CALACA BINGO'], ['216', 'CANDYLAND BINGO'], ['139', 'FORTUNE BINGO'], ['178', 'GO GOAL BINGO'], ['122', 'IRICH BINGO'], ['174', 'JACKPOT BINGO'], ['150', 'LUCKY BINGO'], ['217', 'MAGIC LAMP BINGO'], ['195', 'PEARLS OF BINGO'], ['151', 'SUPER BINGO'], ['173', 'WEST HUNTER BINGO']];
  var LIST_VENDOR = 'JILI';
  var CAT_LIST = ['Hot', 'Slot', 'Casino', 'Poker', 'Bingo', 'Arcade', 'Fishing', 'New'];
  var PLATS = ['NG', 'eBINGO', 'EGAMES'];

  function exportCsv(head, rows, filename) {
    var esc = function (v) { v = String(v == null ? '' : v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
    var text = '\ufeff' + [head].concat(rows).map(function (r) { return r.map(esc).join(','); }).join('\r\n');
    var url = URL.createObjectURL(new Blob([text], { type: 'text/csv;charset=utf-8' }));
    var a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); setTimeout(function () { a.remove(); }, 0);
    setTimeout(function () { URL.revokeObjectURL(url); }, 30000);
  }
  function inList(list, id) { return list.some(function (x) { return x[0] === String(id).trim(); }); }
  function classify(vendor, gameId) {
    if (vendor !== LIST_VENDOR) return 'EGAMES';
    if (inList(NG_LIST, gameId)) return 'NG';
    if (inList(EB_LIST, gameId)) return 'eBINGO';
    return 'EGAMES';
  }
  function nowStr() {
    var d = new Date(Date.now() - 4 * 3600 * 1000);
    var p = function (n) { return (n < 10 ? '0' : '') + n; };
    return d.getUTCFullYear() + '-' + p(d.getUTCMonth() + 1) + '-' + p(d.getUTCDate()) + ' ' + p(d.getUTCHours()) + ':' + p(d.getUTCMinutes()) + ':' + p(d.getUTCSeconds());
  }
  function g0(id, upd, vendor, gameId, name, cats, plat, trial, max, min, rtp, on) {
    return { id: id, addTime: '2025-07-18 12:00:00', updTime: upd, vendor: vendor, gameId: gameId, name: name, cats: cats, plat: plat,
      gameSort: '9999', trial: trial, max: max, min: min, rtp: rtp, on: on, home: true, terms: ['PC', '移动端'], jackpot: false,
      remark: '', visible: '标准范围', pcCover: '已上传封面', mCover: '已上传封面' };
  }
  function blankForm() {
    return { vendor: '', gameId: '', name: '', cats: [], plat: '', status: '启用', visible: '标准范围', gameSort: '',
      terms: ['移动端', 'PC'], trial: false, home: false, jackpot: false, mult: '', remark: '', coverTab: 'pc', pcCover: '', mCover: '' };
  }

  var SETTLE_ROWS = [
    ['Playerkv09x8922', '2437734005000220403', '2026-09-29 17:46:15', 'Super Ace Deluxe', 'bingo_992044868', '20.000'],
    ['Playerzrk228920', '2437722008000750049', '2026-09-29 17:33:45', 'Super Ace', 'bingo_992044870', '5.000'],
    ['Playerng95x4515', '2437718312000430049', '2026-09-29 17:29:54', 'Super Ace', 'bingo_992044872', '5.000'],
    ['Playerzshkc2709', '2437702760000260049', '2026-09-29 17:13:42', 'Super Ace', 'bingo_992044874', '200.000'],
    ['Playerzshkc2709', '2437701496000180049', '2026-09-29 17:12:23', 'Super Ace', 'bingo_992044874', '5.000'],
    ['Playerp1ibn4877', '2437696344001760049', '2026-09-29 17:07:01', 'Super Ace', 'bingo_992044875', '5.000']
  ];
  var CATS = [['Hot', true, 'Hot', '10'], ['Slot', false, '老虎机', '9'], ['Casino', false, '', '8'], ['Poker', false, 'Poker', '7'], ['Bingo', false, '', '6'], ['Arcade', false, '', '5']];
  var NAV = ['厂商设置', '返水设定', '第三方对局查询', '第三方对局查询(结算时间)', '第三方其他费用', '游戏入口设置', 'SEO游戏介绍'];
  var TABS = [['短信列表', '短信列表'], ['第三方对局查询', '第三方对局查询'], ['厂商设置', '厂商设置'], ['第三方对局查询(结算时间)', '第三方对局查询(结...'], ['第三方其他费用', '第三方其他费用'], ['游戏入口设置', '游戏入口设置']];
  var SETTLE = '第三方对局查询(结算时间)', BET = '第三方对局查询', ENTRY = '游戏入口设置';

  // ---------- 原型组件 ----------
  class App extends Component {
    constructor() {
      super();
      this.state = {
        page: ENTRY, entryTab: 'cfg',
        open: false, sel: '', applied: '',
        cfgOpen: false, cfgSel: '', cfgApplied: '',
        catOn: { Hot: true, Slot: true, Casino: true, Poker: true, Bingo: true, Arcade: true },
        games: [
          g0(3749, '2026-09-04 13:48:32', 'SLOT', '19', 'Hot Spin', ['Hot', 'Slot', 'New'], 'EGAMES', true, '2,000.00', '0.40', '96.17%', false),
          g0(3929, '2026-09-27 18:24:38', 'FC', '22071', 'SUGAR BANG BANG2', ['Slot'], 'EGAMES', false, '4,000.00', '1.20', '96.50%', true),
          g0(4983, '2026-04-29 06:29:45', 'WE', 'STUDIO-BAA-5', 'Traditional 5', ['Hot', 'Slot'], 'EGAMES', false, '100,000.00', '5.00', '98.94%', false),
          g0(4984, '2026-08-24 18:32:12', 'WE', 'STUDIO-BAL-102', 'GOF BAC', [], 'EGAMES', false, '100,000.00', '5.00', '98.00%', false),
          g0(4985, '2026-01-16 17:19:07', 'WE', 'STUDIO-BAL-118', 'GOF BAC 1', ['Casino'], 'EGAMES', false, '100,000.00', '5.00', '98.00%', true),
          g0(4986, '2026-09-10 10:12:05', 'JILI', '241', 'KENO', ['Bingo'], 'NG', false, '-', '-', '-', true),
          g0(4987, '2026-09-10 10:15:41', 'JILI', '111', 'NUMBER KING', ['Bingo'], 'EGAMES', false, '-', '-', '-', true),
          g0(4988, '2026-09-11 14:02:19', 'JILI', '177', 'BINGO ADVENTURE', ['Bingo'], 'eBINGO', false, '-', '-', '-', true),
          g0(4989, '2026-09-11 14:08:56', 'JILI', '151', 'SUPER BINGO', ['Bingo'], 'NG', false, '-', '-', '-', true)
        ],
        onlyBad: false, listOpen: false, multiplier: '2222',
        modal: null, form: null, err: {}, coverErr: '', toast: ''
      };
    }
    componentWillUnmount() { clearTimeout(this._t); }
    go(p) { this.setState({ page: p, open: false, cfgOpen: false, sel: '', applied: '' }); }
    setForm(patch) { this.setState({ form: Object.assign({}, this.state.form, patch) }); }
    showToast(t) {
      var self = this;
      this.setState({ toast: t });
      clearTimeout(this._t);
      this._t = setTimeout(function () { self.setState({ toast: '' }); }, 2000);
    }
    openEdit(o) {
      this.setState({ modal: { mode: 'edit', id: o.id }, err: {}, coverErr: '', cfgOpen: false, form: {
        vendor: o.vendor, gameId: o.gameId, name: o.name, cats: o.cats.slice(), plat: o.plat, status: o.on ? '启用' : '停用',
        visible: o.visible, gameSort: o.gameSort, terms: o.terms.slice(), trial: o.trial, home: o.home, jackpot: o.jackpot,
        mult: '', remark: o.remark, coverTab: 'pc', pcCover: o.pcCover, mCover: o.mCover } });
    }
    submit() {
      var f = this.state.form, m = this.state.modal;
      var err = { vendor: !f.vendor, gameId: !String(f.gameId).trim(), name: !String(f.name).trim(), cats: f.cats.length === 0,
        plat: !f.plat, gameSort: !String(f.gameSort).trim(), terms: f.terms.length === 0 };
      if (f.plat && f.vendor && String(f.gameId).trim() && f.plat !== classify(f.vendor, f.gameId)) err.platRule = true;
      if (Object.keys(err).some(function (k) { return err[k]; })) { this.setState({ err: err }); return; }
      var t = nowStr();
      var rec = { vendor: f.vendor, gameId: String(f.gameId).trim(), name: String(f.name).trim(),
        cats: CAT_LIST.filter(function (c) { return f.cats.indexOf(c) >= 0; }), plat: f.plat, gameSort: String(f.gameSort).trim(),
        trial: f.trial, on: f.status === '启用', home: f.home, terms: ['PC', '移动端'].filter(function (x) { return f.terms.indexOf(x) >= 0; }),
        jackpot: f.jackpot, remark: f.remark, visible: f.visible, pcCover: f.pcCover, mCover: f.mCover, updTime: t };
      var games;
      if (m.mode === 'add') {
        var maxId = this.state.games.reduce(function (a, g) { return Math.max(a, g.id); }, 0);
        games = [Object.assign({ id: maxId + 1, addTime: t, max: '-', min: '-', rtp: '-' }, rec)].concat(this.state.games);
      } else {
        games = this.state.games.map(function (g) { return g.id === m.id ? Object.assign({}, g, rec) : g; });
      }
      var patch = { games: games, modal: null, form: null, err: {}, coverErr: '' };
      if (String(f.mult).trim()) patch.multiplier = String(f.mult).trim();
      this.setState(patch);
      this.showToast(m.mode === 'add' ? '添加成功' : '编辑成功');
    }

    // --- 通用：下拉 ---
    dropdown(opts, sel, open, toggle, pick, width) {
      var label = sel || '平台名称';
      return html`<div class="dd">
        <button type="button" class="dd-btn" style=${'width:' + width + 'px'} aria-haspopup="listbox" aria-expanded=${open ? 'true' : 'false'} onClick=${toggle}>
          <span class=${sel ? '' : 'ph'}>${label}</span><span class="ph">${open ? '⌃' : '⌄'}</span>
        </button>
        ${open && html`<div class="dd-list" role="listbox" style=${'width:' + width + 'px'}>
          ${opts.map(function (o) { return html`<button type="button" role="option" class=${o === sel ? 'on' : ''} onClick=${function () { pick(o); }}>${o || '平台名称'}</button>`; })}
        </div>`}
      </div>`;
    }

    // --- 第三方对局查询(结算时间) ---
    settlePage() {
      var s = this.state, self = this;
      var applied = s.applied;
      var rows = SETTLE_ROWS.filter(function () { return !applied || applied === 'EGAMES'; });
      var head = ['账号', '订单号', '订单时间', '结算状态', '结算时间', '游戏名称', '游戏厂商', '游戏供应商', '三方用户名', '下注金额 ⇅', '有效投注额 ⇅', '总盈亏 ⇅', '[待确认字段] ⇅', '派彩金额(含JP) ⇅', '平台名称', '所属投注站', '投注设备', '总持量'];
      return html`<div style="padding:10px;display:flex;flex-direction:column">
        <div style="background:#eef0f3;padding:10px;display:flex;flex-direction:column;gap:10px">
          <div style="display:flex;gap:10px">
            <span class="fake" style="width:200px">会员名</span>
            <span class="fake" style="width:130px"><span>分类选择</span><span>⌄</span></span>
            <span class="fake" style="width:200px"><span>游戏平台选择</span><span>⌄</span></span>
            <span class="fake" style="width:200px">游戏名称</span>
            <span class="fake" style="width:200px"><span>游戏类型选择</span><span>⌄</span></span>
            <span class="fake dark" style="width:200px"><span>全部设备</span><span>⌄</span></span>
            <span class="fake dark" style="width:130px"><span>全部</span><span>⌄</span></span>
          </div>
          <div style="display:flex;gap:10px;align-items:center">
            <span class="fake" style="width:410px;justify-content:space-around"><span>开始日期</span><span style="color:#555">~</span><span>结束日期</span></span>
            <span class="fake" style="width:200px">订单号</span>
            <span class="fake dark" style="width:140px"><span>所有渠道</span><span>⌄</span></span>
            <span class="fake dark" style="width:140px"><span>所有投注站</span><span>⌄</span></span>
            <span style="width:60px"></span>
            ${this.dropdown([''].concat(PLATS), s.sel, s.open, function () { self.setState({ open: !self.state.open }); }, function (o) { self.setState({ sel: o, open: false }); }, 128)}
            <button type="button" class="btn" onClick=${function () { self.setState({ applied: self.state.sel, open: false }); }}>搜索</button>
            <button type="button" class="btn" onClick=${function () {
              var lines = rows.map(function (r) { return [r[0], r[1], r[2], '已结算', r[2], r[3], 'JILI', 'JILI', r[4], r[5], r[5], '-' + r[5], '0.000', '0.000', 'EGAMES', 'bb wave', 'PC', r[5]]; });
              exportCsv(head.map(function (h) { return h.replace(' ⇅', ''); }), lines, (s.page === BET ? 'bet_records_by_bet_time_' : 'bet_records_by_settle_time_') + (applied || 'ALL') + '.csv');
              self.showToast('已导出 ' + lines.length + ' 条注单（平台名称：' + (applied || '全部') + '）');
            }}>导出</button>
          </div>
        </div>
        <div style="display:flex;justify-content:flex-end;padding:8px 0"><button type="button" class="btn">总计</button></div>
        <div class="grid" style="grid-template-columns:repeat(18,minmax(0,1fr))">
          ${head.map(function (h) { return html`<div class="th">${h}</div>`; })}
          ${rows.map(function (r) {
            return [r[0], r[1], r[2], '已结算', r[2], r[3], 'JILI', 'JILI', r[4], r[5], r[5], '-' + r[5], '0.000', '0.000', 'EGAMES', 'bb wave', 'PC', r[5]]
              .map(function (v) { return html`<div style="min-height:70px">${v}</div>`; });
          })}
          ${rows.length === 0 && html`<div class="empty">暂无数据</div>`}
        </div>
      </div>`;
    }

    // --- 游戏类别管理 ---
    catPage() {
      var s = this.state, self = this;
      var head = ['类别名称', 'PC列表ICON', 'PC未选中ICON', 'PC已选中ICON', '移动端列表ICON', '移动端未选中ICON', '移动端已选中ICON', '备注', '游戏排序', '是否开启', '操作'];
      return html`<div style="padding:16px;display:flex;flex-direction:column;gap:28px">
        <div style="display:flex;gap:6px;align-items:center">
          <span class="fake" style="width:204px"><span>类别</span><span>⌄</span></span>
          <span class="fake" style="width:132px"><span>是否开启</span><span>⌄</span></span>
          <button type="button" class="btn">搜索</button><button type="button" class="btn">重置</button><button type="button" class="btn">添加类别</button>
        </div>
        <div style="border:1px solid #ebeef5;padding:10px">
          <div class="grid" style="grid-template-columns:repeat(11,minmax(0,1fr))">
            ${head.map(function (h) { return html`<div class="th" style="min-height:40px">${h}</div>`; })}
            ${CATS.map(function (c) {
              var on = !!s.catOn[c[0]];
              var cells = [html`<div style="height:96px">${c[0]} <span style="color:#3b9ae1;margin-left:4px">+</span></div>`];
              for (var i = 0; i < 3; i++) cells.push(html`<div>${c[1] ? html`<span class="icon-ph">${c[0]} ICON</span>` : html`<span class="failed">FAILED</span>`}</div>`);
              for (var j = 0; j < 3; j++) cells.push(html`<div><span class="icon-ph">${c[0]} ICON</span></div>`);
              cells.push(html`<div>${c[2]}</div>`, html`<div>${c[3]}</div>`);
              cells.push(html`<div><button type="button" role="switch" aria-checked=${on ? 'true' : 'false'} aria-label="是否开启" class=${'switch' + (on ? ' on' : '')}
                onClick=${function () { var m = Object.assign({}, self.state.catOn); m[c[0]] = !on; self.setState({ catOn: m }); }}><span></span></button></div>`);
              cells.push(html`<div style="gap:14px"><a class="link" href="#">编辑</a><a class="link" style="color:#a0a8b3" href="#">删除</a></div>`);
              return cells;
            })}
          </div>
        </div>
      </div>`;
    }

    // --- 游戏配置 ---
    cfgPage() {
      var s = this.state, self = this;
      var badCount = s.games.filter(function (o) { return o.plat !== classify(o.vendor, o.gameId); }).length;
      var list = s.games.filter(function (o) {
        return (!s.cfgApplied || o.plat === s.cfgApplied) && (!s.onlyBad || o.plat !== classify(o.vendor, o.gameId));
      });
      var head = ['ID', '添加时间', '更新时间', '游戏厂商', '厂商名称', '游戏ID', '游戏名称', '游戏类别', '平台名称', '游戏标签', 'PC端游戏封面', 'PC端游戏封面大图', '移动端游戏封面', '移动端游戏封面大图', '备注', '厂商排序', '游戏排序', '在线人数 ⇅', '在线人数展示倍数 ⇅', '是否首页推荐', '游戏终端', '是否支持试玩', '是否开启累积奖池', '最大投注额', '最小投注额', 'RTP', '是否开启', '操作'];
      return html`<div style="padding:16px;display:flex;flex-direction:column;gap:10px">
        <div style="display:flex;gap:6px;align-items:center">
          <span class="fake" style="width:168px;padding:0 12px"><span>请选择游戏厂商</span><span>⌄</span></span>
          <span class="fake" style="width:190px;padding:0 12px">支持厂商名称、游戏名称、游...</span>
          <span class="fake" style="width:124px;padding:0 12px"><span>游戏类别</span><span>⌄</span></span>
          <div style="position:relative">
            ${this.dropdown([''].concat(PLATS), s.cfgSel, s.cfgOpen, function () { self.setState({ cfgOpen: !self.state.cfgOpen }); }, function (o) { self.setState({ cfgSel: o, cfgOpen: false }); }, 128)}
          </div>
          <span class="fake" style="width:116px;padding:0 12px"><span>是否开启</span><span>⌄</span></span>
          <span class="fake" style="width:116px;padding:0 12px"><span>游戏终端</span><span>⌄</span></span>
          <span class="fake" style="width:172px;padding:0 12px"><span>是否开启累积奖池</span><span>⌄</span></span>
          <span class="fake" style="width:172px;padding:0 12px"><span>是否支持试玩</span><span>⌄</span></span>
          <span class="fake" style="width:160px;padding:0 12px">在线人数展示倍数</span>
          <button type="button" class="btn" onClick=${function () { self.setState({ cfgApplied: self.state.cfgSel, cfgOpen: false }); }}>搜索</button>
          <button type="button" class="btn" onClick=${function () { self.setState({ cfgSel: '', cfgApplied: '', cfgOpen: false }); }}>重置</button>
        </div>
        <div style="display:flex;justify-content:flex-end;gap:10px;padding-right:62px">
          <button type="button" class="btn" onClick=${function () { self.setState({ modal: { mode: 'add' }, form: blankForm(), err: {}, coverErr: '', cfgOpen: false }); }}>添加游戏</button>
        </div>
        <div style="border:1px solid #ebeef5;padding:10px;overflow-x:auto">
          <div class="grid" style="width:2860px;grid-template-columns:repeat(28,minmax(0,1fr))">
            ${head.map(function (h) { return html`<div class=${'th' + (h === '平台名称' ? ' hl' : '')} style="min-height:86px;line-height:1.6">${h}</div>`; })}
            ${list.map(function (o) {
              var vm = VENDORS[o.vendor] || { name: '', sort: '' };
              var expect = classify(o.vendor, o.gameId), bad = o.plat !== expect, on = !!o.on;
              var c = function (v) { return html`<div style="min-height:105px">${v}</div>`; };
              return [
                c(String(o.id)), c(o.addTime), c(o.updTime), c(o.vendor), c(vm.name), c(o.gameId),
                c(html`<span>${o.name} <span style="color:#3b9ae1">+</span></span>`), c(o.cats.join(',')),
                html`<div style=${'min-height:105px;flex-direction:column;gap:6px;background:' + (bad ? '#fff5f5' : '#f7fbff')}>
                  <span class=${'tag ' + o.plat}>${o.plat}</span>
                  ${bad && html`<span class="bad-note">分类异常<br />应为 ${expect}</span>`}
                </div>`,
                c(''), c(o.pcCover ? html`<span class="cover-ph">封面</span>` : html`<span class="failed">FAILED</span>`), c(html`<span class="failed">FAILED</span>`),
                c(o.mCover ? html`<span class="cover-ph">封面</span>` : html`<span class="failed">FAILED</span>`), c(html`<span class="failed">FAILED</span>`),
                c(o.remark), c(vm.sort), c(o.gameSort), c('0'), c(s.multiplier), c(o.home ? '是' : '否'), c(o.terms.join(',')),
                c(o.trial ? '支持' : '不支持'), c(o.jackpot ? '开启' : '关闭'), c(o.max), c(o.min), c(o.rtp),
                c(html`<button type="button" role="switch" aria-checked=${on ? 'true' : 'false'} aria-label="是否开启" class=${'switch' + (on ? ' on' : '')} style="width:36px"
                  onClick=${function () { self.setState({ games: self.state.games.map(function (x) { return x.id === o.id ? Object.assign({}, x, { on: !on }) : x; }) }); }}><span style=${on ? 'left:18px' : ''}></span></button>`),
                html`<div style="min-height:105px;gap:14px">
                  <button type="button" class="link" onClick=${function () { self.openEdit(o); }}>编辑</button>
                  <a href="#" class=${'link' + (on ? ' dis' : '')} aria-disabled=${on ? 'true' : 'false'} onClick=${function (e) { e.preventDefault(); }}>删除</a>
                </div>`
              ];
            })}
            ${list.length === 0 && html`<div class="empty">暂无数据</div>`}
          </div>
        </div>
      </div>`;
    }

    // --- 名单弹窗 ---
    listDialog() {
      var self = this;
      var col = function (title, cls, rows) {
        return html`<div class="list-col"><div class="h" style=${cls}>${title}</div>
          ${rows.map(function (x) { return html`<div class="r"><span style="width:90px">${x[0]}</span><span>${x[1]}</span></div>`; })}</div>`;
      };
      return html`<div class="mask" style="z-index:55;padding-top:80px"><div class="dialog" role="dialog" aria-modal="true" aria-label="PAGCOR分类名单" style="width:760px">
        <div class="hd"><span>PAGCOR分类名单（只读）</span><button type="button" class="x" aria-label="关闭" onClick=${function () { self.setState({ listOpen: false }); }}>×</button></div>
        <div style="padding:0 20px 8px;font-size:13px;color:#606266">依据 MegaXcess / PAGCOR 最新确认规则。名单外的游戏一律归类为 EGAMES。名单变更需由技术配置并审批。</div>
        <div style="display:flex;gap:20px;padding:12px 20px 24px;align-items:flex-start">
          ${col('NG（7 款）', 'background:#fff4e5;color:#a35a0c', NG_LIST.map(function (x) { return [x[0] + ' - V. 1', x[1]]; }))}
          ${col('eBINGO（13 款）', 'background:#eaf7ec;color:#1f7a35', EB_LIST)}
        </div>
      </div></div>`;
    }

    // --- 添加 / 编辑弹窗 ---
    gameDialog() {
      var self = this, s = this.state, f = s.form, err = s.err;
      var vm = VENDORS[f.vendor] || { name: '', sort: '' };
      var expect = classify(f.vendor, f.gameId);
      var ready = !!f.vendor && !!String(f.gameId).trim();
      var mismatch = ready && !!f.plat && f.plat !== expect;
      var val = function (k) { return function (e) { var p = {}; p[k] = e.target.value; self.setForm(p); }; };
      var onVendor = function (e) { var v = e.target.value; self.setForm({ vendor: v, plat: v && String(self.state.form.gameId).trim() ? classify(v, self.state.form.gameId) : self.state.form.plat }); };
      var onGameId = function (e) { var v = e.target.value; var fv = self.state.form.vendor; self.setForm({ gameId: v, plat: fv && String(v).trim() ? classify(fv, v) : self.state.form.plat }); };
      var checks = function (key, items) {
        return items.map(function (t) {
          var on = f[key].indexOf(t) >= 0;
          return html`<label class=${on ? 'on' : ''}><input type="checkbox" checked=${on} onChange=${function () {
            var cur = self.state.form[key]; var p = {}; p[key] = on ? cur.filter(function (x) { return x !== t; }) : cur.concat([t]); self.setForm(p);
          }} />${t}</label>`;
        });
      };
      var radios = function (label, key, opts) {
        return html`<div class="row center"><span class="lb"><span class="req">* </span>${label}:</span>
          <div class="checks" role="radiogroup" aria-label=${label} style="width:auto">
            ${opts.map(function (op) {
              var on = f[key] === op[1];
              return html`<label class=${on ? 'on' : ''}><input type="radio" name=${'r-' + key} checked=${on} onChange=${function () { var p = {}; p[key] = op[1]; self.setForm(p); }} />${op[0]}</label>`;
            })}
          </div></div>`;
      };
      var pc = f.coverTab === 'pc';
      var onFile = function (e) {
        var file = e.target.files && e.target.files[0];
        if (!file) return;
        if (!/\.(jpe?g|png|gif|webp|pag|webm)$/i.test(file.name)) { self.setState({ coverErr: '文件格式不支持，请上传jpg/png/gif/webp/pag/webm文件' }); return; }
        if (file.size > 2 * 1024 * 1024) { self.setState({ coverErr: '文件大小不能超过2MB' }); return; }
        self.setState({ coverErr: '' });
        self.setForm(pc ? { pcCover: file.name } : { mCover: file.name });
      };
      var close = function () { self.setState({ modal: null, form: null, err: {}, coverErr: '' }); };
      var title = s.modal.mode === 'add' ? '添加游戏' : '编辑游戏';
      return html`<div class="mask"><div class="dialog" role="dialog" aria-modal="true" aria-label=${title} style="width:960px;height:910px">
        <div class="hd"><span>${title}</span><button type="button" class="x" aria-label="关闭" onClick=${close}>×</button></div>
        <div class="bd">
          <div class="row"><label class="lb" for="f-vendor"><span class="req">* </span>游戏厂商:</label>
            <div class="col"><select id="f-vendor" class="sel" value=${f.vendor} onChange=${onVendor}>
              <option value="">请选择游戏厂商</option><option value="SLOT">SLOT</option><option value="FC">FC</option><option value="WE">WE</option><option value="JILI">JILI</option>
            </select>${err.vendor && html`<span class="err">请选择游戏厂商</span>`}</div></div>
          <div class="row center"><label class="lb" for="f-vname">厂商名称:</label><input id="f-vname" class="in ro" style="width:237px" disabled value=${vm.name} /></div>
          <div class="row"><label class="lb" for="f-gid"><span class="req">* </span>游戏ID:</label>
            <div class="col"><input id="f-gid" class="in" value=${f.gameId} onInput=${onGameId} />${err.gameId && html`<span class="err">请输入游戏ID</span>`}</div></div>
          <div class="row"><label class="lb" for="f-name"><span class="req">* </span>游戏名称:</label>
            <div class="col"><input id="f-name" class="in" value=${f.name} onInput=${val('name')} />${err.name && html`<span class="err">请输入游戏名称</span>`}</div></div>
          <div class="row"><span class="lb"><span class="req">* </span>游戏类别:</span>
            <div class="col"><div class="checks" role="group" aria-label="游戏类别">${checks('cats', CAT_LIST)}</div>${err.cats && html`<span class="err">请至少选择一个游戏类别</span>`}</div></div>
          <div class="row plat-row"><label class="lb" for="f-plat"><span class="req">* </span>平台名称:</label>
            <div class="col">
              <div style="display:flex;align-items:center;gap:10px">
                <select id="f-plat" class="sel hl" value=${f.plat} onChange=${val('plat')}>
                  <option value="">请选择平台名称</option>
                  ${PLATS.map(function (p) { return html`<option value=${p} disabled=${ready && expect !== p}>${p}</option>`; })}
                </select>
              </div>
              <span class="hint">按「游戏厂商 + 游戏ID」对照PAGCOR分类名单自动带出：名单内游戏只能选对应分类，名单外游戏只能选EGAMES</span>
              ${err.plat && html`<span class="err">请选择平台名称</span>`}
              ${mismatch && html`<span class="err">当前分类与PAGCOR分类名单不一致，该游戏应为 ${expect}</span>`}
            </div></div>
          <div class="row center"><label class="lb" for="f-status">状态:</label>
            <select id="f-status" class="sel" value=${f.status} onChange=${val('status')}><option value="启用">启用</option><option value="停用">停用</option></select></div>
          <div class="row center"><label class="lb" for="f-vis">可见范围:</label>
            <select id="f-vis" class="sel" value=${f.visible} onChange=${val('visible')}><option value="标准范围">标准范围</option></select></div>
          <div class="row"><label class="lb" for="f-gsort"><span class="req">* </span>游戏排序:</label>
            <div class="col"><input id="f-gsort" class="in" value=${f.gameSort} onInput=${val('gameSort')} />${err.gameSort && html`<span class="err">请输入游戏排序</span>`}</div></div>
          <div class="row center"><label class="lb" for="f-vsort">厂商排序:</label><input id="f-vsort" class="in ro" disabled value=${vm.sort} /></div>
          <div class="row"><span class="lb"><span class="req">* </span>游戏终端:</span>
            <div class="col"><div class="checks" role="group" aria-label="游戏终端">${checks('terms', ['移动端', 'PC'])}</div>${err.terms && html`<span class="err">请至少选择一个游戏终端</span>`}</div></div>
          ${radios('支持试玩', 'trial', [['支持', true], ['不支持', false]])}
          ${radios('首页推荐', 'home', [['否', false], ['是', true]])}
          ${radios('是否开启累积奖池', 'jackpot', [['关闭', false], ['开启', true]])}
          <div class="row center"><label class="lb" for="f-mult">在线人数展示倍数:</label>
            <input id="f-mult" class="in" style="font-size:12px" placeholder="全局在线人数展示倍数（所有游戏共享同一值；传了就写回，不传则不改动现有倍数）" value=${f.mult} onInput=${val('mult')} /></div>
          <div class="row center"><label class="lb" for="f-remark">备注:</label><input id="f-remark" class="in" value=${f.remark} onInput=${val('remark')} /></div>
          <div class="cover-box">
            <div class="ctabs" role="tablist">
              <button type="button" role="tab" aria-selected=${pc ? 'true' : 'false'} class=${pc ? 'on' : ''} onClick=${function () { self.setForm({ coverTab: 'pc' }); self.setState({ coverErr: '' }); }}>PC配置</button>
              <button type="button" role="tab" aria-selected=${pc ? 'false' : 'true'} class=${pc ? '' : 'on'} onClick=${function () { self.setForm({ coverTab: 'm' }); self.setState({ coverErr: '' }); }}>移动端配置</button>
            </div>
            <div class="row" style="padding:14px 20px 36px">
              <span class="lb">${pc ? 'PC端游戏封面' : '移动端游戏封面'}:</span>
              <div class="col" style="gap:8px">
                <div style="display:flex;gap:114px;align-items:center">
                  <label class="file-btn">选择文件<input type="file" accept=".jpg,.jpeg,.png,.gif,.webp,.pag,.webm" style="display:none" onChange=${onFile} /></label>
                  <span class="file-name">${(pc ? f.pcCover : f.mCover) || ''}</span>
                </div>
                <span style="font-size:12px">只能上传jpg/png/gif/webp/pag/webm文件，且不超过2MB</span>
                ${s.coverErr && html`<span class="err">${s.coverErr}</span>`}
              </div>
            </div>
          </div>
        </div>
        <div class="ft"><button type="button" class="btn" onClick=${close}>取 消</button><button type="button" class="btn" onClick=${function () { self.submit(); }}>确 定</button></div>
      </div></div>`;
    }

    render(_, s) {
      var self = this;
      var isSettle = s.page === SETTLE || s.page === BET, isEntry = s.page === ENTRY, isCat = s.entryTab === 'cat';
      return html`<div class="root">
        <div class="topbar"><div>当前时间: <span class="time">2026/09/29 06:24:55 -04:00</span></div><div class="right"><span>⛶</span><span>简体中文</span><span>Joshua0926 ▾</span></div></div>
        <div class="statbar">
          <span>在线人数: <span style="color:#ff8a3d">37</span></span><span>当日注册: <span style="color:#ffd24d">39</span></span>
          <span>实名认证-待处理: <span style="color:#4cd964">0</span></span><span>当日充值成功: <span style="color:#ffd24d">62</span></span>
          <span class="item">充值: <span class="badge red">0</span></span><span class="item">提款: <span class="badge green">0</span></span>
          <span class="item">提款超时(>30分): <span class="badge red">2</span></span><span class="item">风控审核: <span class="badge green">0</span></span>
          <span class="item">风控超时(>30分): <span class="badge red">1</span></span><span class="item">预算告警: <span class="badge red">0</span></span>
        </div>
        <div class="body">
          <nav class="sidebar" aria-label="侧边栏菜单">
            <div class="menu-title">菜单 ☰</div>
            <div class="group" style="padding-left:24px">个人中心</div>
            ${['用户管理', '财务管理', '提现管理', '数据报表', '平台概况'].map(function (g) { return html`<div class="group"><span>${g}</span><span class="caret">⌄</span></div>`; })}
            <div class="group open"><span>游戏管理</span><span class="caret">⌃</span></div>
            <div class="sub">${NAV.map(function (n) { return html`<button type="button" class=${n === s.page ? 'on' : ''} onClick=${function () { self.go(n); }}>▸ ${n}</button>`; })}</div>
            <div class="group after"><span>公告管理</span><span class="caret">⌄</span></div>
          </nav>
          <div class="main">
            <div class="crumb"><span>位置 > ${s.page}</span><span class="search">搜索页面...</span></div>
            <div class="tabs">${TABS.map(function (t) { return html`<button type="button" class=${t[0] === s.page ? 'on' : ''} onClick=${function () { self.go(t[0]); }}>${t[1]} ×</button>`; })}</div>
            <div class="content">
              ${isSettle && this.settlePage()}
              ${isEntry && html`<div style="display:flex;flex-direction:column">
                <div class="mod-tabs" role="tablist">
                  <button type="button" role="tab" aria-selected=${isCat ? 'true' : 'false'} class=${isCat ? 'on' : ''} onClick=${function () { self.setState({ entryTab: 'cat', cfgOpen: false }); }}>游戏类别管理</button>
                  <button type="button" role="tab" aria-selected=${isCat ? 'false' : 'true'} class=${isCat ? '' : 'on'} onClick=${function () { self.setState({ entryTab: 'cfg' }); }}>游戏配置</button>
                </div>
                ${isCat ? html`<div style="display:flex;align-items:center;justify-content:center;color:#999;font-size:14px;padding:120px 0">【游戏类别管理】不在本次需求与原型范围内</div>` : this.cfgPage()}
              </div>`}
              ${!isSettle && !isEntry && html`<div style="display:flex;align-items:center;justify-content:center;color:#999;font-size:14px;padding:120px 0">【${s.page}】不在本次需求与原型范围内</div>`}
            </div>
          </div>
        </div>
        ${s.toast && html`<div class="toast" role="status">${s.toast}</div>`}
        ${s.listOpen && this.listDialog()}
        ${s.modal && s.form && this.gameDialog()}
      </div>`;
    }
  }

  render(html`<${App} />`, document.getElementById('app'));
})();
