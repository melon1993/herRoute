import { useState, useEffect } from "react";

// --- 模拟数据 ---
const defaultTasks = [
  { id: 1, name: "送朵朵去实验小学", location: "北京市海淀区实验小学", timeWindow: { start: "07:30", end: "08:00" }, duration: 5, type: "school", priority: "high", lat: 39.968, lng: 116.318 },
  { id: 2, name: "去公司上班", location: "中关村软件园", timeWindow: { start: "08:30", end: "09:00" }, duration: 0, type: "work", priority: "high", lat: 40.053, lng: 116.281 },
  { id: 3, name: "永辉超市买菜", location: "永辉超市(万达店)", timeWindow: { start: "12:00", end: "13:00" }, duration: 20, type: "shopping", priority: "medium", lat: 39.935, lng: 116.314 },
  { id: 4, name: "接朵朵放学", location: "北京市海淀区实验小学", timeWindow: { start: "14:30", end: "15:00" }, duration: 5, type: "school", priority: "high", lat: 39.968, lng: 116.318 },
  { id: 5, name: "带妈妈去眼科医院", location: "北京同仁医院", timeWindow: { start: "15:30", end: "16:30" }, duration: 60, type: "hospital", priority: "high", lat: 39.900, lng: 116.418 },
  { id: 6, name: "回家", location: "家 · 万柳书院", timeWindow: { start: "17:30", end: "" }, duration: 0, type: "home", priority: "medium", lat: 39.952, lng: 116.305 },
];

const optimizedSchedule = [
  { time: "07:20", action: "从家出发", target: "实验小学", duration: "12分钟", distance: "3.2km", traffic: "畅通", status: "done" },
  { time: "07:35", action: "送朵朵到校", target: "", duration: "停留5分钟", distance: "", traffic: "", status: "done" },
  { time: "07:40", action: "出发去公司", target: "中关村软件园", duration: "18分钟", distance: "5.8km", traffic: "畅通", status: "done" },
  { time: "08:00", action: "到达公司", target: "", duration: "", distance: "", traffic: "", status: "done" },
  { time: "12:15", action: "出发去超市", target: "永辉超市(万达店)", duration: "8分钟", distance: "2.1km", traffic: "轻度拥堵", status: "done" },
  { time: "12:25", action: "采购", target: "", duration: "约20分钟", distance: "", traffic: "", status: "done" },
  { time: "12:50", action: "返回公司", target: "中关村软件园", duration: "8分钟", distance: "2.1km", traffic: "畅通", status: "done" },
  { time: "14:20", action: "出发去学校", target: "实验小学", duration: "10分钟", distance: "3.5km", traffic: "畅通", status: "current" },
  { time: "14:30", action: "接朵朵放学", target: "", duration: "停留5分钟", distance: "", traffic: "", status: "pending" },
  { time: "14:40", action: "出发去医院", target: "同仁医院", duration: "22分钟", distance: "7.3km", traffic: "畅通", status: "pending" },
  { time: "15:05", action: "到达医院", target: "", duration: "就诊约60分钟", distance: "", traffic: "", status: "pending" },
  { time: "16:10", action: "出发回家", target: "万柳书院", duration: "25分钟", distance: "8.1km", traffic: "预计拥堵", status: "pending" },
  { time: "16:40", action: "到家", target: "", duration: "", distance: "", traffic: "", status: "pending" },
];

const typeIcons = {
  school: "🏫",
  work: "💼",
  shopping: "🛒",
  hospital: "🏥",
  home: "",
  gym: "🏋️",
  bank: "🏦",
};

const typeColors = {
  school: "#6366f1",
  work: "#0ea5e9",
  shopping: "#22c55e",
  hospital: "#ef4444",
  home: "#f59e0b",
  gym: "#8b5cf6",
  bank: "#14b8a6",
};

// --- 主应用 ---
export default function HerRouteApp() {
  const [screen, setScreen] = useState("home");
  const [tasks, setTasks] = useState(defaultTasks);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState("");
  const [inputText, setInputText] = useState("");
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({ name: "", location: "", timeStart: "", timeEnd: "", type: "shopping", duration: 15 });
  const [saving, setSaving] = useState(false);

  const totalDistance = "22.1km";
  const savedDistance = "6.3km";
  const savedTime = "35分钟";

  // 模拟动态调整通知
  useEffect(() => {
    if (screen === "timeline") {
      const timer = setTimeout(() => {
        setNotificationMsg("📢 朵朵老师通知：今天提前到14:30放学（比平时早30分钟），已自动调整下午行程。");
        setShowNotification(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  const handleAddTask = () => {
    if (!newTask.name || !newTask.location) return;
    setSaving(true);
    setTimeout(() => {
      const task = {
        id: Date.now(),
        name: newTask.name,
        location: newTask.location,
        timeWindow: { start: newTask.timeStart, end: newTask.timeEnd },
        duration: newTask.duration,
        type: newTask.type,
        priority: "medium",
        lat: 39.94 + Math.random() * 0.04,
        lng: 116.30 + Math.random() * 0.12,
      };
      setTasks([...tasks, task]);
      setNewTask({ name: "", location: "", timeStart: "", timeEnd: "", type: "shopping", duration: 15 });
      setShowAddTask(false);
      setSaving(false);
      setNotificationMsg(`✅ 已添加「${task.name}」，路线已重新优化`);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }, 800);
  };

  const handleVoiceInput = () => {
    setInputText("早上8点送朵朵去实验小学，然后我去公司，中午要去永辉超市买菜，下午3点接朵朵放学，4点半带妈去市医院复查");
  };

  const handleParse = () => {
    if (!inputText.trim()) return;
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setScreen("timeline");
    }, 1500);
  };

  const removeTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
    setNotificationMsg("🗑️ 已移除任务，路线已重新优化");
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2500);
  };

  // --- 渲染 ---
  return (
    <div style={{ maxWidth: 420, margin: "0 auto", minHeight: "100vh", background: "#f8f9fc", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", position: "relative", overflow: "hidden" }}>
      {/* 顶部状态栏 */}
      <div style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "12px 20px 16px", color: "white" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 13, opacity: 0.8 }}>2026年9月8日 星期二</div>
            <div style={{ fontSize: 20, fontWeight: 700, marginTop: 2 }}>她出行 HerRoute</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 20, padding: "6px 14px", fontSize: 13, cursor: "pointer" }} onClick={() => setScreen("home")}>
              🏠 首页
            </div>
          </div>
        </div>
      </div>

      {/* 通知横幅 */}
      {showNotification && (
        <div style={{ background: "#fffbeb", borderBottom: "1px solid #fde68a", padding: "12px 20px", fontSize: 13, color: "#92400e", animation: "slideDown 0.3s ease", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>{notificationMsg}</span>
          <span onClick={() => setShowNotification(false)} style={{ cursor: "pointer", marginLeft: 8, fontSize: 16 }}>✕</span>
        </div>
      )}

      {/* ===== 首页 ===== */}
      {screen === "home" && (
        <div style={{ padding: 20 }}>
          {/* 今日概览卡片 */}
          <div style={{ background: "white", borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#1e293b" }}>今日行程</div>
              <div style={{ background: "#eef2ff", color: "#6366f1", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 600 }}>
                {tasks.length} 个任务
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: "#6366f1" }}>{tasks.length}</div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>待办任务</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: "#0ea5e9" }}>{totalDistance}</div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>总里程</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: "#22c55e" }}>{savedTime}</div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>预计节省</div>
              </div>
            </div>

            {/* 任务列表 */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {tasks.map((task) => (
                <div key={task.id} style={{ display: "flex", alignItems: "center", padding: "10px 12px", background: "#f8fafc", borderRadius: 12, border: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: 22, marginRight: 12 }}>{typeIcons[task.type] || "📍"}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>{task.name}</div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 1 }}>{task.location} · {task.timeWindow.start}{task.timeWindow.end ? `-${task.timeWindow.end}` : ""}</div>
                  </div>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: typeColors[task.type] || "#94a3b8" }} />
                  <span onClick={() => removeTask(task.id)} style={{ marginLeft: 8, cursor: "pointer", color: "#94a3b8", fontSize: 14 }}>✕</span>
                </div>
              ))}
            </div>
          </div>

          {/* 快捷操作 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
            <button onClick={() => setScreen("input")} style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", color: "white", border: "none", borderRadius: 14, padding: "14px 8px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 22 }}>🗺️</span>
              规划路线
            </button>
            <button onClick={() => setScreen("timeline")} style={{ background: "white", color: "#1e293b", border: "1px solid #e2e8f0", borderRadius: 14, padding: "14px 8px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <span style={{ fontSize: 22 }}></span>
              行程时间轴
            </button>
            <button onClick={() => setScreen("family")} style={{ background: "white", color: "#1e293b", border: "1px solid #e2e8f0", borderRadius: 14, padding: "14px 8px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <span style={{ fontSize: 22 }}>👨‍‍👧</span>
              家庭协同
            </button>
          </div>

          {/* 智能推荐 */}
          <div style={{ background: "white", borderRadius: 16, padding: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", marginBottom: 12 }}>💡 智能推荐</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ background: "#f0fdf4", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#166534", border: "1px solid #bbf7d0" }}>
                🛒 永辉超市今天鸡蛋特价，是否加入今天的采购清单？
              </div>
              <div style={{ background: "#eff6ff", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#1e40af", border: "1px solid #bfdbfe" }}>
                 明天是周一，需要我帮你规划送朵朵上学和上班的路线吗？
              </div>
              <div style={{ background: "#fdf4ff", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#86198f", border: "1px solid #f5d0fe" }}>
                👨 老公今天下午也在医院附近，可以顺路接妈妈回家
              </div>
            </div>
          </div>

          {/* 底部统计 */}
          <div style={{ marginTop: 16, background: "white", borderRadius: 16, padding: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", marginBottom: 12 }}>📊 本周出行统计</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <div style={{ textAlign: "center", padding: 12, background: "#f8fafc", borderRadius: 10 }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#6366f1" }}>126km</div>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>本周总里程</div>
              </div>
              <div style={{ textAlign: "center", padding: 12, background: "#f8fafc", borderRadius: 10 }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#22c55e" }}>3.2h</div>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>本周节省时间</div>
              </div>
              <div style={{ textAlign: "center", padding: 12, background: "#f8fafc", borderRadius: 10 }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#f59e0b" }}>92%</div>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>准时到达率</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== 输入页 ===== */}
      {screen === "input" && (
        <div style={{ padding: 20 }}>
          <button onClick={() => setScreen("home")} style={{ background: "none", border: "none", color: "#6366f1", fontSize: 14, cursor: "pointer", marginBottom: 16, padding: 0 }}>
            ← 返回首页
          </button>

          <div style={{ background: "white", borderRadius: 16, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#1e293b", marginBottom: 6 }}>告诉我你今天要去哪里</div>
            <div style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>用自然语言描述，我来帮你规划最优路线</div>

            {/* 语音输入按钮 */}
            <button onClick={handleVoiceInput} style={{ width: "100%", background: "#f8fafc", border: "2px dashed #cbd5e1", borderRadius: 12, padding: "20px 16px", fontSize: 14, color: "#475569", cursor: "pointer", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <span style={{ fontSize: 24 }}>🎙️</span>
              <span>点击模拟语音输入</span>
            </button>

            {/* 文本输入 */}
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="例如：早上8点送孩子去学校，然后去公司，中午去超市买菜，下午3点接孩子，4点带妈去医院..."
              style={{ width: "100%", minHeight: 100, border: "1px solid #e2e8f0", borderRadius: 12, padding: 14, fontSize: 14, color: "#1e293b", resize: "vertical", outline: "none", fontFamily: "inherit", boxSizing: "border-box", lineHeight: 1.6 }}
            />

            {/* 解析按钮 */}
            <button onClick={handleParse} disabled={!inputText.trim() || saving} style={{ width: "100%", marginTop: 16, background: saving ? "#a5b4fc" : "linear-gradient(135deg, #667eea, #764ba2)", color: "white", border: "none", borderRadius: 12, padding: "14px 0", fontSize: 15, fontWeight: 600, cursor: saving ? "default" : "pointer", opacity: !inputText.trim() ? 0.5 : 1, transition: "all 0.3s" }}>
              {saving ? "⏳ 正在智能规划路线..." : "🗺️ 开始规划路线"}
            </button>
          </div>

          {/* 手动添加任务 */}
          <div style={{ marginTop: 16 }}>
            <button onClick={() => setShowAddTask(!showAddTask)} style={{ width: "100%", background: "white", border: "1px solid #e2e8f0", borderRadius: 12, padding: "12px 16px", fontSize: 14, color: "#475569", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <span style={{ fontSize: 18 }}>＋</span> 手动添加任务
            </button>

            {showAddTask && (
              <div style={{ background: "white", borderRadius: 16, padding: 20, marginTop: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, color: "#1e293b" }}>添加新任务</div>

                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 12, color: "#64748b", marginBottom: 4, display: "block" }}>任务名称</label>
                  <input value={newTask.name} onChange={(e) => setNewTask({ ...newTask, name: e.target.value })} placeholder="如：去银行办事" style={{ width: "100%", border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 12px", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                </div>

                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 12, color: "#64748b", marginBottom: 4, display: "block" }}>地点</label>
                  <input value={newTask.location} onChange={(e) => setNewTask({ ...newTask, location: e.target.value })} placeholder="如：工商银行万柳支行" style={{ width: "100%", border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 12px", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, color: "#64748b", marginBottom: 4, display: "block" }}>最早开始</label>
                    <input type="time" value={newTask.timeStart} onChange={(e) => setNewTask({ ...newTask, timeStart: e.target.value })} style={{ width: "100%", border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 12px", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: "#64748b", marginBottom: 4, display: "block" }}>最晚结束</label>
                    <input type="time" value={newTask.timeEnd} onChange={(e) => setNewTask({ ...newTask, timeEnd: e.target.value })} style={{ width: "100%", border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 12px", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, color: "#64748b", marginBottom: 6, display: "block" }}>任务类型</label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {Object.entries(typeIcons).map(([type, icon]) => (
                      <button key={type} onClick={() => setNewTask({ ...newTask, type })} style={{ background: newTask.type === type ? typeColors[type] : "#f1f5f9", color: newTask.type === type ? "white" : "#475569", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                        {icon} {type === "school" ? "学校" : type === "work" ? "工作" : type === "shopping" ? "购物" : type === "hospital" ? "医院" : type === "home" ? "回家" : type === "gym" ? "健身" : "银行"}
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={handleAddTask} disabled={!newTask.name || !newTask.location || saving} style={{ width: "100%", background: saving ? "#a5b4fc" : "#6366f1", color: "white", border: "none", borderRadius: 10, padding: "12px 0", fontSize: 14, fontWeight: 600, cursor: saving ? "default" : "pointer" }}>
                  {saving ? "添加中..." : "添加到今日行程"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== 时间轴页 ===== */}
      {screen === "timeline" && (
        <div style={{ padding: 20 }}>
          <button onClick={() => setScreen("home")} style={{ background: "none", border: "none", color: "#6366f1", fontSize: 14, cursor: "pointer", marginBottom: 16, padding: 0 }}>
            ← 返回首页
          </button>

          {/* 行程摘要 */}
          <div style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", borderRadius: 16, padding: 20, color: "white", marginBottom: 16 }}>
            <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 8 }}>今日智能路线</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <div style={{ fontSize: 28, fontWeight: 700 }}>{totalDistance}</div>
                <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>总里程 · 12个节点</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: "#86efac" }}>节省 {savedDistance}</div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>约 {savedTime}</div>
              </div>
            </div>
          </div>

          {/* 模拟地图 */}
          <div style={{ background: "#e8f4f8", borderRadius: 16, height: 180, marginBottom: 16, position: "relative", overflow: "hidden", border: "1px solid #bae6fd" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(180deg, #e0f2fe 0%, #bae6fd 50%, #e0f2fe 100%)", opacity: 0.5 }} />
            {/* 模拟路线 */}
            <svg width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
              <path d="M 60 140 Q 120 80 180 100 Q 240 120 300 60 Q 340 40 370 80" stroke="#6366f1" strokeWidth="3" fill="none" strokeDasharray="8,4" opacity="0.6" />
              <path d="M 60 140 Q 120 80 180 100 Q 240 120 300 60 Q 340 40 370 80" stroke="#6366f1" strokeWidth="3" fill="none" />
            </svg>
            {/* 模拟标记点 */}
            {[
              { x: 60, y: 140, label: "家", color: "#f59e0b" },
              { x: 180, y: 100, label: "学校", color: "#6366f1" },
              { x: 300, y: 60, label: "公司", color: "#0ea5e9" },
              { x: 240, y: 120, label: "超市", color: "#22c55e" },
              { x: 370, y: 80, label: "医院", color: "#ef4444" },
            ].map((p, i) => (
              <div key={i} style={{ position: "absolute", left: p.x - 14, top: p.y - 14, width: 28, height: 28, borderRadius: "50% 50% 50% 0", background: p.color, transform: "rotate(-45deg)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }}>
                <span style={{ transform: "rotate(45deg)", fontSize: 11, color: "white", fontWeight: 700 }}>{i + 1}</span>
              </div>
            ))}
            <div style={{ position: "absolute", bottom: 8, right: 12, background: "rgba(255,255,255,0.9)", borderRadius: 8, padding: "4px 10px", fontSize: 11, color: "#475569" }}>
              百度地图 LBS · 智能路线
            </div>
          </div>

          {/* 时间轴 */}
          <div style={{ background: "white", borderRadius: 16, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", marginBottom: 16 }}>行程时间轴</div>

            <div style={{ position: "relative" }}>
              {optimizedSchedule.map((item, index) => {
                const isDone = item.status === "done";
                const isCurrent = item.status === "current";
                const dotColor = isDone ? "#22c55e" : isCurrent ? "#6366f1" : "#cbd5e1";
                const lineColor = index < optimizedSchedule.length - 1 ? (isDone ? "#22c55e" : "#e2e8f0") : "transparent";

                return (
                  <div key={index} style={{ display: "flex", gap: 14, position: "relative" }}>
                    {/* 时间线 */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 20 }}>
                      <div style={{ width: 12, height: 12, borderRadius: "50%", background: dotColor, border: isCurrent ? "3px solid #c7d2fe" : "none", flexShrink: 0, boxShadow: isCurrent ? "0 0 0 4px rgba(99,102,241,0.15)" : "none" }} />
                      {index < optimizedSchedule.length - 1 && (
                        <div style={{ width: 2, flex: 1, background: lineColor, minHeight: 30 }} />
                      )}
                    </div>

                    {/* 内容 */}
                    <div style={{ flex: 1, paddingBottom: index < optimizedSchedule.length - 1 ? 16 : 0, opacity: isDone ? 0.7 : 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: isCurrent ? "#6366f1" : "#1e293b" }}>{item.time}</div>
                        {item.traffic && (
                          <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, background: item.traffic === "畅通" ? "#dcfce7" : item.traffic === "轻度拥堵" ? "#fef3c7" : "#fee2e2", color: item.traffic === "畅通" ? "#166534" : item.traffic === "轻度拥堵" ? "#92400e" : "#991b1b" }}>
                            {item.traffic}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", marginTop: 2 }}>{item.action}</div>
                      {item.target && <div style={{ fontSize: 12, color: "#64748b", marginTop: 1 }}>→ {item.target}</div>}
                      {item.duration && <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 1 }}>{item.duration}{item.distance ? ` · ${item.distance}` : ""}</div>}
                      {isCurrent && (
                        <div style={{ marginTop: 8, background: "#eef2ff", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#4338ca", display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ animation: "pulse 2s infinite" }}></span> 正在前往 · 预计10分钟到达
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 底部操作 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 16 }}>
            <button onClick={() => setScreen("family")} style={{ background: "white", color: "#f5576c", border: "1px solid #fecdd3", borderRadius: 12, padding: "12px 0", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
               家庭协同
            </button>
            <button style={{ background: "white", color: "#6366f1", border: "1px solid #c7d2fe", borderRadius: 12, padding: "12px 0", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              📤 分享行程
            </button>
            <button onClick={() => setScreen("input")} style={{ background: "#6366f1", color: "white", border: "none", borderRadius: 12, padding: "12px 0", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              ✏️ 修改行程
            </button>
          </div>
        </div>
      )}

      {/* ===== 家庭协同页 ===== */}
      {screen === "family" && (
        <div style={{ padding: 20 }}>
          <button onClick={() => setScreen("home")} style={{ background: "none", border: "none", color: "#6366f1", fontSize: 14, cursor: "pointer", marginBottom: 16, padding: 0 }}>
            ← 返回首页
          </button>

          {/* 家庭卡片 */}
          <div style={{ background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", borderRadius: 16, padding: 20, color: "white", marginBottom: 16 }}>
            <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 10 }}>我的家庭</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {["👩 李婷", "👨 张伟", " 朵朵"].map((member, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.25)", borderRadius: 20, padding: "6px 14px", fontSize: 13, fontWeight: 600, backdropFilter: "blur(4px)" }}>
                    {member}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ marginTop: 12, fontSize: 12, opacity: 0.85 }}>3位成员 · 今日共 18 个出行任务 · 可合并优化 3 条路线</div>
          </div>

          {/* 家人实时状态 */}
          <div style={{ background: "white", borderRadius: 16, padding: 18, marginBottom: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", marginBottom: 14 }}>家人实时动态</div>

            {/* 老公 */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}></div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>张伟（老公）</span>
                  <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, background: "#dcfce7", color: "#166534" }}>在线</span>
                </div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 3 }}>当前位置：中关村软件园附近</div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>今日行程：公司 → 客户会议(14:00) → 回家</div>
                <div style={{ marginTop: 8, background: "#f0fdf4", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#166534", border: "1px solid #bbf7d0" }}>
                  ✨ 智能匹配：老公15:30会议结束，距离同仁医院仅2.5km，可以顺路接妈妈回家，节省约18分钟
                </div>
              </div>
            </div>

            {/* 女儿 */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 0" }}>
              <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#fce7f3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>👧</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>朵朵（女儿）</span>
                  <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, background: "#fef3c7", color: "#92400e" }}>在校</span>
                </div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 3 }}>当前位置：北京市海淀区实验小学</div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>今日行程：上学(07:30) → 放学(14:30提前) → 回家</div>
              </div>
            </div>
          </div>

          {/* 路线合并建议 */}
          <div style={{ background: "white", borderRadius: 16, padding: 18, marginBottom: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", marginBottom: 12 }}> 路线合并建议</div>

            <div style={{ background: "#fef3c7", borderRadius: 12, padding: 14, marginBottom: 10, border: "1px solid #fde68a" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#92400e", marginBottom: 6 }}>建议1：接妈妈回家路线合并</div>
              <div style={{ fontSize: 12, color: "#78350f", lineHeight: 1.6 }}>
                李婷16:10从医院出发回家（25分钟）<br/>
                张伟15:30会议结束，16:00可从医院附近出发<br/>
                <strong>合并后：</strong>张伟顺路接妈妈，李婷直接回家，全家节省约35分钟
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <button style={{ background: "#f59e0b", color: "white", border: "none", borderRadius: 8, padding: "6px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>采纳方案</button>
                <button style={{ background: "#f1f5f9", color: "#475569", border: "none", borderRadius: 8, padding: "6px 16px", fontSize: 12, cursor: "pointer" }}>暂不考虑</button>
              </div>
            </div>

            <div style={{ background: "#eff6ff", borderRadius: 12, padding: 14, border: "1px solid #bfdbfe" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1e40af", marginBottom: 6 }}>建议2：周末采购分工</div>
              <div style={{ fontSize: 12, color: "#1e3a5f", lineHeight: 1.6 }}>
                本周六李婷要带朵朵去兴趣班（10:00-11:30）<br/>
                张伟周六上午空闲，可以负责去山姆采购<br/>
                <strong>系统已生成张伟的采购最优路线</strong>（山姆→盒马→回家，共8.2km）
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <button style={{ background: "#3b82f6", color: "white", border: "none", borderRadius: 8, padding: "6px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>发送给老公</button>
                <button style={{ background: "#f1f5f9", color: "#475569", border: "none", borderRadius: 8, padding: "6px 16px", fontSize: 12, cursor: "pointer" }}>修改后再发</button>
              </div>
            </div>
          </div>

          {/* 家庭消息 */}
          <div style={{ background: "white", borderRadius: 16, padding: 18, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", marginBottom: 12 }}>💬 家庭出行消息</div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>👨</div>
                <div style={{ background: "#f1f5f9", borderRadius: "4px 12px 12px 12px", padding: "10px 14px", fontSize: 13, color: "#1e293b", maxWidth: "85%" }}>
                  我今天下午会议改到3点半了，接妈的事你安排吧
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>10:23</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, alignItems: "flex-start", flexDirection: "row-reverse" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#fce7f3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>👩</div>
                <div style={{ background: "#eef2ff", borderRadius: "12px 4px 12px 12px", padding: "10px 14px", fontSize: 13, color: "#1e293b", maxWidth: "85%" }}>
                  没事，系统已经重新规划了，你开完会直接回家就行，我去接妈 
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>10:25</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>👨</div>
                <div style={{ background: "#f1f5f9", borderRadius: "4px 12px 12px 12px", padding: "10px 14px", fontSize: 13, color: "#1e293b", maxWidth: "85%" }}>
                  👍 辛苦啦！晚上我来做饭
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>10:26</div>
                </div>
              </div>
            </div>

            {/* 快捷消息 */}
            <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
              {["我晚到10分钟", "你能顺路接孩子吗？", "今天谁去超市？"].map((msg, i) => (
                <button key={i} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 20, padding: "6px 14px", fontSize: 12, color: "#475569", cursor: "pointer" }}>
                  {msg}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CSS动画 */}
      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        textarea:focus, input:focus {
          border-color: #6366f1 !important;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }
      `}</style>
    </div>
  );
}
