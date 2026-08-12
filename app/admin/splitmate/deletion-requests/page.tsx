"use client";

import React, { useState, useEffect } from "react";
import { getClientAuth } from "@/lib/firebaseClient";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User,
} from "firebase/auth";
import {
  ShieldAlert,
  Lock,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  LogOut,
  RefreshCw,
  Eye,
  AlertTriangle,
  Mail,
  UserCheck,
} from "lucide-react";

interface DeletionRequest {
  requestId: string;
  app: string;
  fullName: string;
  email: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "PROCESSING" | "FAILED_PROCESSING" | "REJECTED" | "COMPLETED";
  source: string;
  createdAt: string;
  targetUid?: string;
  requestVerificationStatus?: string;
  emailStatus?: { support?: string; user?: string };
  supportEmailId?: string;
  userEmailId?: string;
  emailProcessedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewedByEmail?: string;
  rejectionReason?: string;
  approvalEmailStatus?: string;
  rejectionEmailStatus?: string;
  failureCode?: string;
  failedStep?: string;
  deletionProgress?: Record<string, string>;
  auditTrail?: Array<{
    id: string;
    action: string;
    performedByEmail: string;
    timestamp: string;
    rejectionReason?: string;
    failureCode?: string;
    failedStep?: string;
  }>;
}

export default function SplitMateAdminDashboard() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard Data State
  const [requests, setRequests] = useState<DeletionRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [fetchError, setFetchError] = useState("");

  // Filters & Search
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal / Action State
  const [selectedRequest, setSelectedRequest] = useState<DeletionRequest | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [actionType, setActionType] = useState<"APPROVE" | "REJECT" | "PROCESS" | "DRY_RUN" | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState("");
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);
  const [actionError, setActionError] = useState("");
  const [dryRunReport, setDryRunReport] = useState<any | null>(null);

  const handleDryRun = async () => {
    if (!selectedRequest || !currentUser) return;
    setIsSubmittingAction(true);
    setActionError("");
    setDryRunReport(null);

    try {
      const token = await currentUser.getIdToken();
      const res = await fetch(
        `/api/admin/splitmate/deletion-requests/${selectedRequest.requestId}/dry-run`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to execute dry-run audit.");
      }

      setDryRunReport(data.report);
      setActionType("DRY_RUN");
    } catch (err: any) {
      setActionError(err.message || "Error running dry-run audit.");
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleProcessDeletion = async () => {
    if (!selectedRequest || !currentUser) return;
    setIsSubmittingAction(true);
    setActionError("");

    try {
      const token = await currentUser.getIdToken();
      const res = await fetch(
        `/api/admin/splitmate/deletion-requests/${selectedRequest.requestId}/process`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to process deletion.");
      }

      await fetchRequests(currentUser);
      await openRequestDetail({ ...selectedRequest, status: "COMPLETED" });
      setActionType(null);
    } catch (err: any) {
      setActionError(err.message || "Error processing account deletion.");
    } finally {
      setIsSubmittingAction(false);
    }
  };

  // Track Firebase Auth state
  useEffect(() => {
    const auth = getClientAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
      if (user) {
        fetchRequests(user);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);
    try {
      const auth = getClientAuth();
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
    } catch (err: any) {
      console.error("Login failed:", err);
      setLoginError(err.message || "Failed to sign in as administrator.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignOut = async () => {
    const auth = getClientAuth();
    await signOut(auth);
    setRequests([]);
    setSelectedRequest(null);
  };

  const fetchRequests = async (user: User) => {
    setLoadingRequests(true);
    setFetchError("");
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/admin/splitmate/deletion-requests", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const text = await res.text();
        throw new Error(`Server returned non-JSON response (${res.status}): ${text.substring(0, 100)}`);
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch deletion requests.");
      }

      setRequests(data.requests || []);
    } catch (err: any) {
      console.error("Fetch requests error:", err);
      setFetchError(err.message || "An unexpected error occurred.");
    } finally {
      setLoadingRequests(false);
    }
  };

  const openRequestDetail = async (req: DeletionRequest) => {
    setSelectedRequest(req);
    setIsDetailOpen(true);
    setActionType(null);
    setRejectionReasonInput("");
    setActionError("");

    // Fetch full detail & audit log
    if (currentUser) {
      try {
        const token = await currentUser.getIdToken();
        const res = await fetch(`/api/admin/splitmate/deletion-requests/${req.requestId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.request) {
          setSelectedRequest((prev) => ({
            ...prev,
            ...data.request,
            // Fallback to previous verification status if API returned undefined
            requestVerificationStatus: data.request.requestVerificationStatus || prev?.requestVerificationStatus || "PENDING",
          }));
        }
      } catch (err) {
        console.error("Detail fetch error:", err);
      }
    }
  };

  const handleApprove = async () => {
    if (!selectedRequest || !currentUser) return;
    setIsSubmittingAction(true);
    setActionError("");

    try {
      const token = await currentUser.getIdToken();
      const res = await fetch(
        `/api/admin/splitmate/deletion-requests/${selectedRequest.requestId}/approve`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to approve request.");
      }

      // Refresh list & detail
      await fetchRequests(currentUser);
      await openRequestDetail({ ...selectedRequest, status: "APPROVED" });
      setActionType(null);
    } catch (err: any) {
      setActionError(err.message || "Error approving deletion request.");
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest || !currentUser) return;
    if (!rejectionReasonInput.trim() || rejectionReasonInput.trim().length < 3) {
      setActionError("Please enter a valid rejection reason (min 3 characters).");
      return;
    }

    setIsSubmittingAction(true);
    setActionError("");

    try {
      const token = await currentUser.getIdToken();
      const res = await fetch(
        `/api/admin/splitmate/deletion-requests/${selectedRequest.requestId}/reject`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ rejectionReason: rejectionReasonInput.trim() }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to reject request.");
      }

      // Refresh list & detail
      await fetchRequests(currentUser);
      await openRequestDetail({ ...selectedRequest, status: "REJECTED" });
      setActionType(null);
    } catch (err: any) {
      setActionError(err.message || "Error rejecting deletion request.");
    } finally {
      setIsSubmittingAction(false);
    }
  };

  // Stats
  const pendingCount = requests.filter((r) => r.status === "PENDING").length;
  const approvedCount = requests.filter((r) => r.status === "APPROVED").length;
  const rejectedCount = requests.filter((r) => r.status === "REJECTED").length;
  const completedCount = requests.filter((r) => r.status === "COMPLETED").length;

  // Filtered Requests
  const filteredRequests = requests.filter((req) => {
    if (activeFilter !== "ALL" && req.status !== activeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchId = req.requestId.toLowerCase().includes(q);
      const matchName = req.fullName.toLowerCase().includes(q);
      const matchEmail = req.email.toLowerCase().includes(q);
      return matchId || matchName || matchEmail;
    }
    return true;
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500 font-medium">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
          Checking administrator authentication...
        </div>
      </div>
    );
  }

  // Render Login Card if user is not authenticated
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 w-full max-w-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Admin Portal</h1>
              <p className="text-sm text-slate-500">SplitMate &bull; Fyndra Labs</p>
            </div>
          </div>

          {loginError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@fyndralabs.com"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoggingIn ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
              Sign In to Admin Dashboard
            </button>
          </form>

          <p className="mt-6 text-xs text-center text-slate-400">
            Protected area. Server verifies ID token &amp; Firestore <code>/admins/&#123;uid&#125;</code> role.
          </p>
        </div>
      </div>
    );
  }

  // Render Admin Dashboard UI
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-blue-600 text-xl tracking-tight">SplitMate</span>
            <span className="text-slate-300">|</span>
            <span className="text-sm font-semibold text-slate-700">Account Deletion Admin</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-500 font-mono bg-slate-100 px-2.5 py-1 rounded-md">
              {currentUser.email}
            </span>
            <button
              onClick={handleSignOut}
              className="text-xs text-slate-600 hover:text-red-600 font-medium flex items-center gap-1 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {fetchError && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-600" />
              <span>{fetchError}</span>
            </div>
            <button
              onClick={() => fetchRequests(currentUser)}
              className="text-xs font-semibold text-red-800 underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Dashboard Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Pending</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{pendingCount}</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg text-amber-600">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Approved</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{approvedCount}</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-red-600 uppercase tracking-wider">Rejected</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{rejectedCount}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg text-red-600">
              <XCircle className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{completedCount}</p>
            </div>
            <div className="p-3 bg-slate-100 rounded-lg text-slate-500">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            {["ALL", "PENDING", "APPROVED", "REJECTED", "COMPLETED"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeFilter === filter
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, name, or email..."
              className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Request Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {loadingRequests ? (
            <div className="p-12 text-center text-slate-500 text-sm flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
              Loading deletion requests...
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm">
              No deletion requests match the selected criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Request ID</th>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Reason</th>
                    <th className="px-4 py-3">Submitted</th>
                    <th className="px-4 py-3">Verification</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRequests.map((req) => (
                    <tr key={req.requestId} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-slate-900">
                        {req.requestId}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900">{req.fullName}</td>
                      <td className="px-4 py-3 text-slate-600 text-xs">{req.email}</td>
                      <td className="px-4 py-3 text-xs text-slate-500 max-w-xs truncate">
                        {req.reason || "—"}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                        {new Date(req.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {req.requestVerificationStatus === "VERIFIED" ? (
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800">
                            VERIFIED
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600">
                            UNVERIFIED
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {req.status === "PENDING" && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                            PENDING
                          </span>
                        )}
                        {req.status === "APPROVED" && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                            APPROVED
                          </span>
                        )}
                        {req.status === "PROCESSING" && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 animate-pulse">
                            PROCESSING
                          </span>
                        )}
                        {req.status === "FAILED_PROCESSING" && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                            FAILED
                          </span>
                        )}
                        {req.status === "REJECTED" && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                            REJECTED
                          </span>
                        )}
                        {req.status === "COMPLETED" && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-200 text-slate-800">
                            COMPLETED
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => openRequestDetail(req)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ml-auto"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Detailed Modal */}
      {isDetailOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-2xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">
                  {selectedRequest.app} Account Deletion
                </span>
                <div className="flex items-center gap-3 mt-0.5">
                  <h2 className="text-xl font-bold text-slate-900 font-mono">
                    {selectedRequest.requestId}
                  </h2>
                  {selectedRequest.requestVerificationStatus === "VERIFIED" ? (
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800">
                      ✓ VERIFIED
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
                      UNVERIFIED
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                &times;
              </button>
            </div>

            {actionError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{actionError}</span>
              </div>
            )}

            {/* Request Summary Grid */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg text-xs">
              <div>
                <span className="font-semibold text-slate-500 block uppercase">Full Name</span>
                <span className="font-medium text-slate-900 text-sm">{selectedRequest.fullName}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-500 block uppercase">Account Email</span>
                <span className="font-medium text-slate-900 text-sm">{selectedRequest.email}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-500 block uppercase">Submitted At</span>
                <span className="text-slate-700">{new Date(selectedRequest.createdAt).toLocaleString()}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-500 block uppercase">Source</span>
                <span className="text-slate-700">{selectedRequest.source}</span>
              </div>
              <div className="col-span-2">
                <span className="font-semibold text-slate-500 block uppercase">Reason</span>
                <span className="text-slate-800 text-sm italic">{selectedRequest.reason || "—"}</span>
              </div>
            </div>

            {/* Email Status Panel */}
            <div className="border border-slate-200 rounded-lg p-4 space-y-2">
              <h3 className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-600" /> Initial Email Dispatch Status
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500">Support Email: </span>
                  <span className="font-semibold text-slate-900">
                    {selectedRequest.emailStatus?.support || (selectedRequest.supportEmailId ? "SENT" : "—")}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">User Confirmation: </span>
                  <span className="font-semibold text-slate-900">
                    {selectedRequest.emailStatus?.user || (selectedRequest.userEmailId ? "SENT" : "—")}
                  </span>
                </div>
              </div>
            </div>

            {/* Audit & Review History */}
            {selectedRequest.reviewedAt && (
              <div className="border border-slate-200 rounded-lg p-4 space-y-2 bg-slate-50/50">
                <h3 className="text-xs font-bold text-slate-700 uppercase">Review Audit Trail</h3>
                <div className="text-xs space-y-1 text-slate-700">
                  <p>
                    <span className="text-slate-500">Reviewed By:</span> {selectedRequest.reviewedByEmail || selectedRequest.reviewedBy}
                  </p>
                  <p>
                    <span className="text-slate-500">Reviewed At:</span> {new Date(selectedRequest.reviewedAt).toLocaleString()}
                  </p>
                  {selectedRequest.rejectionReason && (
                    <p className="text-red-700 font-medium mt-1">
                      <span className="text-slate-500">Rejection Reason:</span> {selectedRequest.rejectionReason}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Action Dialog / Form */}
            {(selectedRequest.status === "APPROVED" || selectedRequest.status === "FAILED_PROCESSING") && (
              <div className="border-t border-slate-200 pt-4 space-y-4">
                {actionType === null ? (
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <button
                      onClick={handleDryRun}
                      disabled={isSubmittingAction}
                      className="w-full sm:w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4 text-blue-600" /> Run Dry-Run Audit
                    </button>
                    <button
                      onClick={() => setActionType("PROCESS")}
                      className="w-full sm:w-1/2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <UserCheck className="w-4 h-4" />
                      {selectedRequest.status === "FAILED_PROCESSING" ? "Retry Account Deletion" : "Process Account Deletion"}
                    </button>
                  </div>
                ) : actionType === "DRY_RUN" && dryRunReport ? (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900">Dry-Run Impact Audit Report</h4>
                      <span className="text-blue-600 font-mono">UID: {dryRunReport.targetUid}</span>
                    </div>
                    <div className="space-y-1.5 text-slate-700">
                      <p><strong>Private Data to Delete:</strong> {dryRunReport.actionsProposed.deletePrivateData.join(", ")}</p>
                      <p><strong>Group References to Unlink:</strong> {dryRunReport.actionsProposed.removeReferences.join(", ")}</p>
                      <p><strong>Financial Records to Anonymize:</strong> {dryRunReport.actionsProposed.anonymizeFinancialRecords.join(", ")}</p>
                      <p><strong>Financial Math Preserved:</strong> {dryRunReport.actionsProposed.preserveFinancialMath.join(", ")}</p>
                      <p><strong>Auth Target:</strong> {dryRunReport.actionsProposed.authAccount}</p>
                    </div>
                    <button
                      onClick={() => setActionType(null)}
                      className="mt-2 px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-700 font-semibold"
                    >
                      Close Report
                    </button>
                  </div>
                ) : actionType === "PROCESS" ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                    <h4 className="text-sm font-bold text-blue-900">Process Account Deletion?</h4>
                    <p className="text-xs text-blue-800 leading-relaxed">
                      <strong>WARNING:</strong> This action will permanently remove the user&apos;s private SplitMate account data and Auth login credentials. Historical shared expense and settlement records will be preserved and anonymized where necessary.
                    </p>
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={() => setActionType(null)}
                        disabled={isSubmittingAction}
                        className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleProcessDeletion}
                        disabled={isSubmittingAction}
                        className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {isSubmittingAction && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                        Confirm &amp; Execute Deletion
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {selectedRequest.status === "PENDING" && (
              <div className="border-t border-slate-200 pt-4">
                {selectedRequest.requestVerificationStatus !== "VERIFIED" ? (
                  <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xs flex items-center justify-between">
                    <span className="font-semibold flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-600" /> Email verification required before admin approval
                    </span>
                    <button
                      disabled
                      className="px-3 py-1.5 bg-slate-200 text-slate-400 font-semibold rounded cursor-not-allowed text-xs"
                    >
                      Approve Disabled
                    </button>
                  </div>
                ) : actionType === null ? (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setActionType("APPROVE")}
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Approve Deletion Request
                    </button>
                    <button
                      onClick={() => setActionType("REJECT")}
                      className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" /> Reject Request
                    </button>
                  </div>
                ) : actionType === "APPROVE" ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 space-y-3">
                    <h4 className="text-sm font-bold text-emerald-900">Approve Account Deletion Request?</h4>
                    <p className="text-xs text-emerald-800 leading-relaxed">
                      <strong>IMPORTANT:</strong> Approval authorizes the request for processing. The user&apos;s Firebase account and data will <strong>NOT</strong> be deleted during Phase 2B. An approval &amp; verification notification email will be sent to the user.
                    </p>
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={() => setActionType(null)}
                        disabled={isSubmittingAction}
                        className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleApprove}
                        disabled={isSubmittingAction}
                        className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {isSubmittingAction && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                        Confirm Approval
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3">
                    <h4 className="text-sm font-bold text-red-900">Reject Account Deletion Request</h4>
                    <p className="text-xs text-red-800">
                      Please provide a detailed reason for rejecting this request. The reason will be sent to the user.
                    </p>
                    <textarea
                      value={rejectionReasonInput}
                      onChange={(e) => setRejectionReasonInput(e.target.value)}
                      rows={3}
                      placeholder="e.g. Account email does not match our records or active pending settlements exist."
                      className="w-full p-2.5 border border-red-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActionType(null)}
                        disabled={isSubmittingAction}
                        className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleReject}
                        disabled={isSubmittingAction}
                        className="px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {isSubmittingAction && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                        Confirm Rejection
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
