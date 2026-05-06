export default function UnlinkedCoachBanner() {
  return (
    <div style={{ background: "#fff", border: "1px solid #D6D0C4", padding: "2rem", textAlign: "center" }}>
      <div style={{ fontSize: "2rem", marginBottom: "1rem", opacity: .6 }}>🔗</div>
      <h3 className="font-disp" style={{ fontSize: "1.05rem", color: "#141414", marginBottom: ".75rem" }}>
        <span className="ar">حسابك غير مربوط بسجل مدربة</span>
        <span className="en">Your account is not linked to a coach record</span>
      </h3>
      <p style={{ fontSize: ".88rem", color: "#555", lineHeight: 1.65, maxWidth: 540, margin: "0 auto", fontFamily: "'Noto Sans Arabic','DM Sans',sans-serif" }}>
        <span className="ar">يرجى التواصل مع الإدارة لربط حسابك بسجلك في النادي. حتى ذلك الحين، لن تظهر اللاعبات هنا.</span>
        <span className="en">
          Please ask an admin to link this account to your coach record so your assigned players appear here.
          They can do that with one SQL update — see <code>supabase/migrations/0004_coach_assignments.sql</code>.
        </span>
      </p>
    </div>
  );
}
