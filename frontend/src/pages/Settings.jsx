import { useOutletContext } from "react-router-dom";

export default function Settings() {
  const { uid, studentName, handleLogout } = useOutletContext();
  
  // Extract info from UID (e.g., 23BCS12092)
  const admissionYear = uid ? `20${uid.substring(0, 2)}` : "Unknown";
  const branchCode = uid ? uid.substring(2, 5) : "Unknown";
  const rollNumber = uid ? uid.substring(5) : "Unknown";

  return (
    <section className="max-w-4xl mx-auto py-8 px-4 flex flex-col gap-6">
      <div className="surface-card p-8 rounded-2xl border border-outline-variant/20 bg-surface">
        <p className="text-secondary font-bold text-xs uppercase tracking-widest mb-1">Profile Overview</p>
        <h1 className="text-3xl font-headline font-bold text-on-surface mb-2">Account Settings</h1>
        <p className="text-on-surface-variant text-sm">Review your session identity and University dataset details.</p>
      </div>

      <section className="surface-card p-8 rounded-2xl border border-outline-variant/20 bg-surface flex flex-col gap-6">
        <div>
          <h3 className="text-xl font-bold font-headline text-on-surface mb-4 border-b border-outline-variant/10 pb-2">Student Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
            <div className="flex flex-col gap-1">
              <span className="text-on-surface-variant font-medium">Full Name</span>
              <span className="text-on-surface font-bold text-lg">{studentName || "Not Found in Dataset"}</span>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-on-surface-variant font-medium">University UID</span>
              <span className="text-primary font-bold text-lg tracking-wide">{uid}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-on-surface-variant font-medium">Admission Year</span>
              <span className="text-on-surface font-bold">{admissionYear}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-on-surface-variant font-medium">Program/Branch</span>
              <span className="text-on-surface font-bold">{branchCode}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-on-surface-variant font-medium">Roll Number</span>
              <span className="text-on-surface font-bold">{rollNumber}</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-outline-variant/10 flex items-center gap-4 mt-2">
          <button 
            type="button" 
            className="px-6 py-2.5 rounded-lg font-bold text-sm bg-surface-variant hover:bg-surface-variant/80 text-on-surface transition-colors"
            onClick={handleLogout}
          >
            Switch UID
          </button>
          <button 
            type="button" 
            className="px-6 py-2.5 rounded-lg font-bold text-sm bg-error/10 hover:bg-error/20 text-error transition-colors"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </section>
    </section>
  );
}
