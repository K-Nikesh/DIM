// "use client"

// import { useState, useEffect } from "react"
// import { Link, Routes, Route, useNavigate, useLocation } from "react-router-dom"
// import {
//   Home,
//   CreditCard,
//   FileCheck,
//   Shield,
//   User,
//   Settings,
//   LogOut,
//   Plus,
//   CheckCircle,
//   XCircle,
//   Clock,
//   ChevronRight,
//   Search,
//   Key,
// } from "lucide-react"

// function Dashboard() {
//   const [account, setAccount] = useState("")
//   const [isAdmin, setIsAdmin] = useState(false)
//   const [isIssuer, setIsIssuer] = useState(false)
//   const [isRegistered, setIsRegistered] = useState(false)
//   const [sidebarOpen, setSidebarOpen] = useState(true)
//   const [activePage, setActivePage] = useState("overview")
//   const location = useLocation()
//   const navigate = useNavigate()

//   // Check if user is connected
//   useEffect(() => {
//     const checkConnection = async () => {
//       const savedAccount = localStorage.getItem("connectedAccount")
//       if (savedAccount && window.ethereum) {
//         try {
//           const accounts = await window.ethereum.request({ method: "eth_accounts" })
//           if (accounts.length > 0) {
//             setAccount(accounts[0])

//             // Mock data - in real app, these would come from contract calls
//             setIsAdmin(accounts[0].toLowerCase() === "0x123...") // Replace with actual admin check
//             setIsIssuer(true) // Mock data
//             setIsRegistered(true) // Mock data
//           } else {
//             // If not connected, redirect to landing page
//             navigate("/")
//           }
//         } catch (error) {
//           console.error("Error checking connection:", error)
//           navigate("/")
//         }
//       } else {
//         navigate("/")
//       }
//     }

//     checkConnection()

//     // Set active page based on URL
//     const path = location.pathname.split("/")[2] || "overview"
//     setActivePage(path)
//   }, [location, navigate])

//   const disconnectWallet = () => {
//     localStorage.removeItem("connectedAccount")
//     setAccount("")
//     navigate("/")
//   }

//   return (
//     <div className="flex h-screen bg-gray-900 text-white">
//       {/* Sidebar */}
//       <div
//         className={`${sidebarOpen ? "w-64" : "w-20"} bg-gray-800 transition-all duration-300 flex flex-col border-r border-gray-700`}
//       >
//         {/* Logo */}
//         <div className="p-4 flex items-center justify-between border-b border-gray-700">
//           <div className="flex items-center space-x-3">
//             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
//               <Key className="h-5 w-5" />
//             </div>
//             {sidebarOpen && (
//               <div>
//                 <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
//                   DIM
//                 </span>
//                 <div className="text-xs text-blue-300 -mt-1">Dashboard</div>
//               </div>
//             )}
//           </div>
//           <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white">
//             {sidebarOpen ? (
//               <ChevronRight className="h-5 w-5" />
//             ) : (
//               <ChevronRight className="h-5 w-5 transform rotate-180" />
//             )}
//           </button>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 py-4 overflow-y-auto">
//           <ul className="space-y-1 px-2">
//             <li>
//               <Link
//                 to="/dashboard"
//                 className={`flex items-center space-x-3 p-3 rounded-lg ${activePage === "overview" ? "bg-blue-900/50 text-blue-400" : "hover:bg-gray-700"}`}
//                 onClick={() => setActivePage("overview")}
//               >
//                 <Home className="h-5 w-5" />
//                 {sidebarOpen && <span>Overview</span>}
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to="/dashboard/credentials"
//                 className={`flex items-center space-x-3 p-3 rounded-lg ${activePage === "credentials" ? "bg-blue-900/50 text-blue-400" : "hover:bg-gray-700"}`}
//                 onClick={() => setActivePage("credentials")}
//               >
//                 <CreditCard className="h-5 w-5" />
//                 {sidebarOpen && <span>My Credentials</span>}
//               </Link>
//             </li>
//             {isIssuer && (
//               <li>
//                 <Link
//                   to="/dashboard/issue"
//                   className={`flex items-center space-x-3 p-3 rounded-lg ${activePage === "issue" ? "bg-blue-900/50 text-blue-400" : "hover:bg-gray-700"}`}
//                   onClick={() => setActivePage("issue")}
//                 >
//                   <FileCheck className="h-5 w-5" />
//                   {sidebarOpen && <span>Issue Credential</span>}
//                 </Link>
//               </li>
//             )}
//             {isAdmin && (
//               <li>
//                 <Link
//                   to="/dashboard/issuers"
//                   className={`flex items-center space-x-3 p-3 rounded-lg ${activePage === "issuers" ? "bg-blue-900/50 text-blue-400" : "hover:bg-gray-700"}`}
//                   onClick={() => setActivePage("issuers")}
//                 >
//                   <Shield className="h-5 w-5" />
//                   {sidebarOpen && <span>Manage Issuers</span>}
//                 </Link>
//               </li>
//             )}
//             <li>
//               <Link
//                 to="/dashboard/profile"
//                 className={`flex items-center space-x-3 p-3 rounded-lg ${activePage === "profile" ? "bg-blue-900/50 text-blue-400" : "hover:bg-gray-700"}`}
//                 onClick={() => setActivePage("profile")}
//               >
//                 <User className="h-5 w-5" />
//                 {sidebarOpen && <span>Profile</span>}
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to="/dashboard/settings"
//                 className={`flex items-center space-x-3 p-3 rounded-lg ${activePage === "settings" ? "bg-blue-900/50 text-blue-400" : "hover:bg-gray-700"}`}
//                 onClick={() => setActivePage("settings")}
//               >
//                 <Settings className="h-5 w-5" />
//                 {sidebarOpen && <span>Settings</span>}
//               </Link>
//             </li>
//           </ul>
//         </nav>

//         {/* User section */}
//         <div className="p-4 border-t border-gray-700">
//           <div className="flex items-center space-x-3">
//             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
//               <User className="h-5 w-5" />
//             </div>
//             {sidebarOpen && (
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-medium truncate">
//                   {account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : "Not Connected"}
//                 </p>
//                 <p className="text-xs text-gray-400 truncate">{isAdmin ? "Admin" : isIssuer ? "Issuer" : "User"}</p>
//               </div>
//             )}
//             {sidebarOpen && (
//               <button onClick={disconnectWallet} className="text-gray-400 hover:text-white">
//                 <LogOut className="h-5 w-5" />
//               </button>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Main content */}
//       <div className="flex-1 overflow-auto">
//         <Routes>
//           <Route
//             path="/"
//             element={<OverviewPage isRegistered={isRegistered} isAdmin={isAdmin} isIssuer={isIssuer} />}
//           />
//           <Route path="/credentials" element={<CredentialsPage />} />
//           <Route path="/issue" element={<IssueCredentialPage />} />
//           <Route path="/issuers" element={<ManageIssuersPage />} />
//           <Route path="/profile" element={<ProfilePage isRegistered={isRegistered} />} />
//           <Route path="/settings" element={<SettingsPage />} />
//         </Routes>
//       </div>
//     </div>
//   )
// }

// // Overview Page
// function OverviewPage({ isRegistered, isAdmin, isIssuer }) {
//   const stats = [
//     { name: "Total Credentials", value: "12", icon: CreditCard, color: "from-blue-500 to-blue-700" },
//     { name: "Valid Credentials", value: "10", icon: CheckCircle, color: "from-green-500 to-green-700" },
//     { name: "Revoked Credentials", value: "2", icon: XCircle, color: "from-red-500 to-red-700" },
//     { name: "Recent Activity", value: "5", icon: Clock, color: "from-purple-500 to-purple-700" },
//   ]

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold">Dashboard Overview</h1>
//         <div className="flex items-center space-x-2">
//           <div
//             className={`px-3 py-1 rounded-full text-xs font-medium ${isRegistered ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"}`}
//           >
//             {isRegistered ? "Registered" : "Not Registered"}
//           </div>
//           {isAdmin && (
//             <div className="px-3 py-1 rounded-full bg-purple-900/50 text-purple-400 text-xs font-medium">Admin</div>
//           )}
//           {isIssuer && (
//             <div className="px-3 py-1 rounded-full bg-blue-900/50 text-blue-400 text-xs font-medium">Issuer</div>
//           )}
//         </div>
//       </div>

//       {!isRegistered ? (
//         <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
//           <h2 className="text-xl font-bold mb-4">Register Your Identity</h2>
//           <p className="text-gray-300 mb-4">
//             You need to register your identity to use the full features of the Decentralized Identity Manager.
//           </p>
//           <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300">
//             Register Now
//           </button>
//         </div>
//       ) : (
//         <>
//           {/* Stats Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             {stats.map((stat) => (
//               <div key={stat.name} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
//                 <div className="flex items-center justify-between mb-4">
//                   <div
//                     className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}
//                   >
//                     <stat.icon className="h-6 w-6" />
//                   </div>
//                   <span className="text-3xl font-bold">{stat.value}</span>
//                 </div>
//                 <h3 className="text-gray-400">{stat.name}</h3>
//               </div>
//             ))}
//           </div>

//           {/* Recent Activity */}
//           <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
//             <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
//             <div className="space-y-4">
//               {[1, 2, 3].map((i) => (
//                 <div key={i} className="flex items-center p-3 bg-gray-700/50 rounded-lg">
//                   <div className="w-10 h-10 rounded-full bg-blue-900/50 flex items-center justify-center mr-4">
//                     <CreditCard className="h-5 w-5 text-blue-400" />
//                   </div>
//                   <div>
//                     <p className="font-medium">New Credential Issued</p>
//                     <p className="text-sm text-gray-400">2 hours ago</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </>
//       )}

//       {/* Quick Actions */}
//       <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
//         <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <Link
//             to="/dashboard/credentials"
//             className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg flex items-center space-x-3 transition-colors"
//           >
//             <CreditCard className="h-5 w-5 text-blue-400" />
//             <span>View My Credentials</span>
//           </Link>
//           {isIssuer && (
//             <Link
//               to="/dashboard/issue"
//               className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg flex items-center space-x-3 transition-colors"
//             >
//               <FileCheck className="h-5 w-5 text-green-400" />
//               <span>Issue New Credential</span>
//             </Link>
//           )}
//           <Link
//             to="/dashboard/profile"
//             className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg flex items-center space-x-3 transition-colors"
//           >
//             <User className="h-5 w-5 text-purple-400" />
//             <span>Update Profile</span>
//           </Link>
//         </div>
//       </div>
//     </div>
//   )
// }

// // Credentials Page
// function CredentialsPage() {
//   // Mock data for credentials
//   const credentials = [
//     {
//       id: 1,
//       name: "Identity Verification",
//       issuer: "0x742...A1B2",
//       issuedAt: "2023-05-15",
//       status: "valid",
//       type: "KYC",
//     },
//     {
//       id: 2,
//       name: "Professional Certificate",
//       issuer: "0x123...45CD",
//       issuedAt: "2023-06-22",
//       status: "valid",
//       type: "Certificate",
//     },
//     {
//       id: 3,
//       name: "Membership Card",
//       issuer: "0x987...EF12",
//       issuedAt: "2023-04-10",
//       status: "revoked",
//       type: "Membership",
//     },
//     {
//       id: 4,
//       name: "Academic Degree",
//       issuer: "0x456...789A",
//       issuedAt: "2023-07-05",
//       status: "valid",
//       type: "Academic",
//     },
//   ]

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold">My Credentials</h1>
//         <div className="relative">
//           <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search credentials..."
//             className="pl-10 pr-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-wrap gap-4 mb-6">
//         <button className="px-4 py-2 bg-blue-900/50 text-blue-400 rounded-lg">All</button>
//         <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">Valid</button>
//         <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">Revoked</button>
//       </div>

//       {/* Credentials Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//         {credentials.map((credential) => (
//           <div
//             key={credential.id}
//             className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-colors"
//           >
//             <div className="p-6">
//               <div className="flex justify-between items-start mb-4">
//                 <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
//                   <CreditCard className="h-6 w-6" />
//                 </div>
//                 <div
//                   className={`px-3 py-1 rounded-full text-xs font-medium ${
//                     credential.status === "valid" ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"
//                   }`}
//                 >
//                   {credential.status === "valid" ? "Valid" : "Revoked"}
//                 </div>
//               </div>
//               <h3 className="text-lg font-bold mb-2">{credential.name}</h3>
//               <div className="space-y-2 text-sm text-gray-400">
//                 <div className="flex justify-between">
//                   <span>Type:</span>
//                   <span className="text-white">{credential.type}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Issuer:</span>
//                   <span className="text-white">{credential.issuer}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Issued:</span>
//                   <span className="text-white">{credential.issuedAt}</span>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-gray-700 p-4 flex justify-between">
//               <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">View Details</button>
//               <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">Verify</button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Add Credential Button (floating) */}
//       <button className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300">
//         <Plus className="h-6 w-6" />
//       </button>
//     </div>
//   )
// }

// // Issue Credential Page
// function IssueCredentialPage() {
//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <h1 className="text-3xl font-bold mb-8">Issue Credential</h1>

//       <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
//         <h2 className="text-xl font-bold mb-6">Create New Credential</h2>

//         <div className="space-y-6">
//           <div>
//             <label className="block text-sm font-medium mb-2">Recipient Address</label>
//             <input
//               type="text"
//               placeholder="0x..."
//               className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-2">Credential Type</label>
//             <select className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
//               <option>Identity Verification</option>
//               <option>Professional Certificate</option>
//               <option>Academic Degree</option>
//               <option>Membership</option>
//               <option>Custom</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-2">Credential Name</label>
//             <input
//               type="text"
//               placeholder="e.g. Professional Certificate"
//               className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-2">Credential Data (JSON)</label>
//             <textarea
//               rows={5}
//               placeholder='{"name": "John Doe", "certification": "Blockchain Developer", ...}'
//               className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             ></textarea>
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-2">Expiration (Optional)</label>
//             <input
//               type="date"
//               className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div className="flex justify-end space-x-4">
//             <button className="px-6 py-2 border border-gray-600 rounded-lg hover:bg-gray-700">Cancel</button>
//             <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg">
//               Issue Credential
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
//         <h2 className="text-xl font-bold mb-6">Recently Issued</h2>

//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="text-left text-gray-400 border-b border-gray-700">
//                 <th className="pb-3 font-medium">Recipient</th>
//                 <th className="pb-3 font-medium">Type</th>
//                 <th className="pb-3 font-medium">Issued Date</th>
//                 <th className="pb-3 font-medium">Status</th>
//                 <th className="pb-3 font-medium">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-700">
//               {[1, 2, 3].map((i) => (
//                 <tr key={i} className="hover:bg-gray-700/50">
//                   <td className="py-4">0x742...A1B2</td>
//                   <td className="py-4">Identity Verification</td>
//                   <td className="py-4">2023-08-15</td>
//                   <td className="py-4">
//                     <span className="px-2 py-1 rounded-full bg-green-900/50 text-green-400 text-xs">Valid</span>
//                   </td>
//                   <td className="py-4">
//                     <button className="text-blue-400 hover:text-blue-300 mr-3">View</button>
//                     <button className="text-red-400 hover:text-red-300">Revoke</button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   )
// }

// // Manage Issuers Page
// function ManageIssuersPage() {
//   // Mock data for issuers
//   const issuers = [
//     { id: 1, address: "0x742...A1B2", name: "Identity Authority", status: "active", credentials: 145 },
//     { id: 2, address: "0x123...45CD", name: "Academic Board", status: "active", credentials: 89 },
//     { id: 3, address: "0x987...EF12", name: "Professional Association", status: "inactive", credentials: 56 },
//     { id: 4, address: "0x456...789A", name: "Government Agency", status: "active", credentials: 212 },
//   ]

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold">Manage Issuers</h1>
//         <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg flex items-center space-x-2">
//           <Plus className="h-5 w-5" />
//           <span>Add Issuer</span>
//         </button>
//       </div>

//       {/* Issuers Table */}
//       <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="text-left text-gray-400 border-b border-gray-700">
//                 <th className="pb-3 font-medium">Name</th>
//                 <th className="pb-3 font-medium">Address</th>
//                 <th className="pb-3 font-medium">Status</th>
//                 <th className="pb-3 font-medium">Credentials Issued</th>
//                 <th className="pb-3 font-medium">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-700">
//               {issuers.map((issuer) => (
//                 <tr key={issuer.id} className="hover:bg-gray-700/50">
//                   <td className="py-4">{issuer.name}</td>
//                   <td className="py-4">{issuer.address}</td>
//                   <td className="py-4">
//                     <span
//                       className={`px-2 py-1 rounded-full text-xs ${
//                         issuer.status === "active" ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"
//                       }`}
//                     >
//                       {issuer.status === "active" ? "Active" : "Inactive"}
//                     </span>
//                   </td>
//                   <td className="py-4">{issuer.credentials}</td>
//                   <td className="py-4">
//                     <button className="text-blue-400 hover:text-blue-300 mr-3">Edit</button>
//                     {issuer.status === "active" ? (
//                       <button className="text-red-400 hover:text-red-300">Revoke</button>
//                     ) : (
//                       <button className="text-green-400 hover:text-green-300">Approve</button>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Add Issuer Form */}
//       <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
//         <h2 className="text-xl font-bold mb-6">Add New Issuer</h2>

//         <div className="space-y-6">
//           <div>
//             <label className="block text-sm font-medium mb-2">Issuer Address</label>
//             <input
//               type="text"
//               placeholder="0x..."
//               className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-2">Issuer Name (Optional)</label>
//             <input
//               type="text"
//               placeholder="e.g. Academic Institution"
//               className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-2">Issuer Type</label>
//             <select className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
//               <option>Educational Institution</option>
//               <option>Government Agency</option>
//               <option>Professional Organization</option>
//               <option>Corporate Entity</option>
//               <option>Other</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-2">Notes</label>
//             <textarea
//               rows={3}
//               placeholder="Additional information about this issuer..."
//               className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             ></textarea>
//           </div>

//           <div className="flex justify-end space-x-4">
//             <button className="px-6 py-2 border border-gray-600 rounded-lg hover:bg-gray-700">Cancel</button>
//             <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg">
//               Approve Issuer
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// // Profile Page
// function ProfilePage({ isRegistered }) {
//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <h1 className="text-3xl font-bold mb-8">My Profile</h1>

//       {!isRegistered ? (
//         <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
//           <h2 className="text-xl font-bold mb-4">Register Your Identity</h2>
//           <p className="text-gray-300 mb-6">
//             You need to register your identity to use the full features of the Decentralized Identity Manager.
//             Registration creates your on-chain identity that can receive and manage credentials.
//           </p>

//           <div className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium mb-2">Profile Name (Optional)</label>
//               <input
//                 type="text"
//                 placeholder="e.g. John Doe"
//                 className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-2">Metadata URI (Optional)</label>
//               <input
//                 type="text"
//                 placeholder="IPFS hash or other URI"
//                 className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               <p className="text-xs text-gray-400 mt-1">
//                 You can provide an IPFS hash or other URI pointing to additional profile information.
//               </p>
//             </div>

//             <div className="flex justify-end">
//               <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg">
//                 Register Identity
//               </button>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
//           <div className="flex items-start justify-between mb-6">
//             <div className="flex items-center space-x-4">
//               <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
//                 <User className="h-10 w-10" />
//               </div>
//               <div>
//                 <h2 className="text-xl font-bold">John Doe</h2>
//                 <p className="text-gray-400">Registered since May 15, 2023</p>
//               </div>
//             </div>
//             <div className="px-3 py-1 rounded-full bg-green-900/50 text-green-400 text-xs font-medium">Registered</div>
//           </div>

//           <div className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium mb-2">Wallet Address</label>
//               <div className="flex items-center space-x-2">
//                 <input
//                   type="text"
//                   value="0x742d8d7A8D3D3A1B2C3D4E5F6A7B8C9D0E1F2A3B"
//                   readOnly
//                   className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none"
//                 />
//                 <button className="text-blue-400 hover:text-blue-300">Copy</button>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-2">Profile Name</label>
//               <input
//                 type="text"
//                 value="John Doe"
//                 className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-2">Metadata URI</label>
//               <input
//                 type="text"
//                 value="ipfs://QmW8jfhDLDeZ3XHpKxoT5YBgU1QYHy7VCqM2qHs6AzXZ9B"
//                 className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <div className="flex justify-end space-x-4">
//               <button className="px-6 py-2 border border-gray-600 rounded-lg hover:bg-gray-700">Cancel</button>
//               <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg">
//                 Update Profile
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
//         <h2 className="text-xl font-bold mb-6">Identity Verification Status</h2>

//         <div className="space-y-4">
//           <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
//             <div className="flex items-center space-x-3">
//               <CheckCircle className="h-5 w-5 text-green-400" />
//               <span>Email Verification</span>
//             </div>
//             <span className="text-green-400">Verified</span>
//           </div>

//           <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
//             <div className="flex items-center space-x-3">
//               <CheckCircle className="h-5 w-5 text-green-400" />
//               <span>Phone Verification</span>
//             </div>
//             <span className="text-green-400">Verified</span>
//           </div>

//           <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
//             <div className="flex items-center space-x-3">
//               <XCircle className="h-5 w-5 text-red-400" />
//               <span>KYC Verification</span>
//             </div>
//             <button className="px-3 py-1 bg-blue-900/50 text-blue-400 rounded-lg text-sm">Verify Now</button>
//           </div>

//           <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
//             <div className="flex items-center space-x-3">
//               <XCircle className="h-5 w-5 text-red-400" />
//               <span>Social Media Verification</span>
//             </div>
//             <button className="px-3 py-1 bg-blue-900/50 text-blue-400 rounded-lg text-sm">Verify Now</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// // Settings Page
// function SettingsPage() {
//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <h1 className="text-3xl font-bold mb-8">Settings</h1>

//       <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
//         <h2 className="text-xl font-bold mb-6">Application Settings</h2>

//         <div className="space-y-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="font-medium">Dark Mode</h3>
//               <p className="text-sm text-gray-400">Toggle between light and dark themes</p>
//             </div>
//             <div className="w-12 h-6 bg-blue-600 rounded-full relative">
//               <div className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full"></div>
//             </div>
//           </div>

//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="font-medium">Notifications</h3>
//               <p className="text-sm text-gray-400">Receive alerts for new credentials and updates</p>
//             </div>
//             <div className="w-12 h-6 bg-blue-600 rounded-full relative">
//               <div className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full"></div>
//             </div>
//           </div>

//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="font-medium">Email Notifications</h3>
//               <p className="text-sm text-gray-400">Receive email alerts</p>
//             </div>
//             <div className="w-12 h-6 bg-gray-600 rounded-full relative">
//               <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full"></div>
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-2">Language</label>
//             <select className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
//               <option>English</option>
//               <option>Spanish</option>
//               <option>French</option>
//               <option>German</option>
//               <option>Chinese</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
//         <h2 className="text-xl font-bold mb-6">Privacy Settings</h2>

//         <div className="space-y-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="font-medium">Public Profile</h3>
//               <p className="text-sm text-gray-400">Make your profile visible to others</p>
//             </div>
//             <div className="w-12 h-6 bg-blue-600 rounded-full relative">
//               <div className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full"></div>
//             </div>
//           </div>

//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="font-medium">Show Credentials</h3>
//               <p className="text-sm text-gray-400">Display your credentials publicly</p>
//             </div>
//             <div className="w-12 h-6 bg-gray-600 rounded-full relative">
//               <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full"></div>
//             </div>
//           </div>

//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="font-medium">Data Analytics</h3>
//               <p className="text-sm text-gray-400">Allow anonymous usage data collection</p>
//             </div>
//             <div className="w-12 h-6 bg-blue-600 rounded-full relative">
//               <div className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full"></div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
//         <h2 className="text-xl font-bold mb-6">Security</h2>

//         <div className="space-y-6">
//           <div>
//             <label className="block text-sm font-medium mb-2">Connected Wallet</label>
//             <div className="flex items-center space-x-2">
//               <input
//                 type="text"
//                 value="0x742d8d7A8D3D3A1B2C3D4E5F6A7B8C9D0E1F2A3B"
//                 readOnly
//                 className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none"
//               />
//               <button className="px-4 py-2 bg-red-900/50 text-red-400 rounded-lg">Disconnect</button>
//             </div>
//           </div>

//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="font-medium">Two-Factor Authentication</h3>
//               <p className="text-sm text-gray-400">Add an extra layer of security</p>
//             </div>
//             <button className="px-4 py-2 bg-blue-900/50 text-blue-400 rounded-lg">Enable</button>
//           </div>

//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="font-medium">Auto-Lock</h3>
//               <p className="text-sm text-gray-400">Automatically lock after inactivity</p>
//             </div>
//             <select className="px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
//               <option>5 minutes</option>
//               <option>15 minutes</option>
//               <option>30 minutes</option>
//               <option>1 hour</option>
//               <option>Never</option>
//             </select>
//           </div>

//           <div className="pt-4 border-t border-gray-700">
//             <button className="px-4 py-2 bg-red-900/50 text-red-400 rounded-lg">Delete Account</button>
//             <p className="text-xs text-gray-400 mt-1">
//               This action cannot be undone. All your data will be permanently deleted.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Dashboard


"use client"

import { useState, useEffect } from "react"
import { Link, Routes, Route, useNavigate, useLocation } from "react-router-dom"
import {
  Home,
  CreditCard,
  FileCheck,
  Shield,
  User,
  Settings,
  LogOut,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  ChevronRight,
  Search,
  Key,
  Loader,
  AlertCircle,
} from "lucide-react"
import { useContract } from "../context/ContractContext"
import {uploadMetadataToPinata} from "../utils/pinata"
import {
  registerIdentity,
  issueCredential,
  revokeCredential,
  approveIssuer,
  revokeIssuer,
  storeCredentialData,
} from "../utils/contract"

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activePage, setActivePage] = useState("overview")
  const location = useLocation()
  const navigate = useNavigate()

  const { account, isAdmin, isIssuer, isRegistered, credentials, loading, error, refreshUserData } = useContract()

  // Check if user is connected
  useEffect(() => {
    if (!loading && !account) {
      // If not connected, redirect to landing page
      navigate("/")
    }
  }, [account, loading, navigate])

  // Set active page based on URL
  useEffect(() => {
    const path = location.pathname.split("/")[2] || "overview"
    setActivePage(path)
  }, [location])

  const disconnectWallet = () => {
    localStorage.removeItem("connectedAccount")
    navigate("/")
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
        <div className="flex flex-col items-center">
          <Loader className="h-12 w-12 animate-spin text-blue-500 mb-4" />
          <p className="text-xl">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
        <div className="bg-gray-800 p-8 rounded-xl max-w-md text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300"
          >
            Return to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "w-64" : "w-20"} bg-gray-800 transition-all duration-300 flex flex-col border-r border-gray-700`}
      >
        {/* Logo */}
        <div className="p-4 flex items-center justify-between border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Key className="h-5 w-5" />
            </div>
            {sidebarOpen && (
              <div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                  DIM
                </span>
                <div className="text-xs text-blue-300 -mt-1">Dashboard</div>
              </div>
            )}
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white">
            {sidebarOpen ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5 transform rotate-180" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-2">
            <li>
              <Link
                to="/dashboard"
                className={`flex items-center space-x-3 p-3 rounded-lg ${activePage === "overview" ? "bg-blue-900/50 text-blue-400" : "hover:bg-gray-700"}`}
                onClick={() => setActivePage("overview")}
              >
                <Home className="h-5 w-5" />
                {sidebarOpen && <span>Overview</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/credentials"
                className={`flex items-center space-x-3 p-3 rounded-lg ${activePage === "credentials" ? "bg-blue-900/50 text-blue-400" : "hover:bg-gray-700"}`}
                onClick={() => setActivePage("credentials")}
              >
                <CreditCard className="h-5 w-5" />
                {sidebarOpen && <span>My Credentials</span>}
              </Link>
            </li>
            {isIssuer && (
              <li>
                <Link
                  to="/dashboard/issue"
                  className={`flex items-center space-x-3 p-3 rounded-lg ${activePage === "issue" ? "bg-blue-900/50 text-blue-400" : "hover:bg-gray-700"}`}
                  onClick={() => setActivePage("issue")}
                >
                  <FileCheck className="h-5 w-5" />
                  {sidebarOpen && <span>Issue Credential</span>}
                </Link>
              </li>
            )}
            {isAdmin && (
              <li>
                <Link
                  to="/dashboard/issuers"
                  className={`flex items-center space-x-3 p-3 rounded-lg ${activePage === "issuers" ? "bg-blue-900/50 text-blue-400" : "hover:bg-gray-700"}`}
                  onClick={() => setActivePage("issuers")}
                >
                  <Shield className="h-5 w-5" />
                  {sidebarOpen && <span>Manage Issuers</span>}
                </Link>
              </li>
            )}
            <li>
              <Link
                to="/dashboard/profile"
                className={`flex items-center space-x-3 p-3 rounded-lg ${activePage === "profile" ? "bg-blue-900/50 text-blue-400" : "hover:bg-gray-700"}`}
                onClick={() => setActivePage("profile")}
              >
                <User className="h-5 w-5" />
                {sidebarOpen && <span>Profile</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/settings"
                className={`flex items-center space-x-3 p-3 rounded-lg ${activePage === "settings" ? "bg-blue-900/50 text-blue-400" : "hover:bg-gray-700"}`}
                onClick={() => setActivePage("settings")}
              >
                <Settings className="h-5 w-5" />
                {sidebarOpen && <span>Settings</span>}
              </Link>
            </li>
          </ul>
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <User className="h-5 w-5" />
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : "Not Connected"}
                </p>
                <p className="text-xs text-gray-400 truncate">{isAdmin ? "Admin" : isIssuer ? "Issuer" : "User"}</p>
              </div>
            )}
            {sidebarOpen && (
              <button onClick={disconnectWallet} className="text-gray-400 hover:text-white">
                <LogOut className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route
            path="/"
            element={
              <OverviewPage
                isRegistered={isRegistered}
                isAdmin={isAdmin}
                isIssuer={isIssuer}
                credentials={credentials}
              />
            }
          />
          <Route
            path="/credentials"
            element={
              <CredentialsPage
                credentials={credentials}
                onRevokeCredential={revokeCredential}
                account={account}
                refreshData={refreshUserData}
              />
            }
          />
          <Route
            path="/issue"
            element={
              <IssueCredentialPage
                onIssueCredential={issueCredential}
                storeCredentialData={storeCredentialData}
                refreshData={refreshUserData}
              />
            }
          />
          <Route
            path="/issuers"
            element={
              <ManageIssuersPage
                onApproveIssuer={approveIssuer}
                onRevokeIssuer={revokeIssuer}
                refreshData={refreshUserData}
              />
            }
          />
          <Route
            path="/profile"
            element={
              <ProfilePage
                isRegistered={isRegistered}
                onRegisterIdentity={registerIdentity}
                account={account}
                refreshData={refreshUserData}
              />
            }
          />
          <Route path="/settings" element={<SettingsPage account={account} />} />
        </Routes>
      </div>
    </div>
  )
}

// Overview Page
function OverviewPage({ isRegistered, isAdmin, isIssuer, credentials }) {
  const validCredentials = credentials.filter((cred) => !cred.isRevoked).length
  const revokedCredentials = credentials.filter((cred) => cred.isRevoked).length

  const stats = [
    {
      name: "Total Credentials",
      value: credentials.length.toString(),
      icon: CreditCard,
      color: "from-blue-500 to-blue-700",
    },
    {
      name: "Valid Credentials",
      value: validCredentials.toString(),
      icon: CheckCircle,
      color: "from-green-500 to-green-700",
    },
    {
      name: "Revoked Credentials",
      value: revokedCredentials.toString(),
      icon: XCircle,
      color: "from-red-500 to-red-700",
    },
    { name: "Recent Activity", value: "5", icon: Clock, color: "from-purple-500 to-purple-700" },
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <div className="flex items-center space-x-2">
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium ${isRegistered ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"}`}
          >
            {isRegistered ? "Registered" : "Not Registered"}
          </div>
          {isAdmin && (
            <div className="px-3 py-1 rounded-full bg-purple-900/50 text-purple-400 text-xs font-medium">Admin</div>
          )}
          {isIssuer && (
            <div className="px-3 py-1 rounded-full bg-blue-900/50 text-blue-400 text-xs font-medium">Issuer</div>
          )}
        </div>
      </div>

      {!isRegistered ? (
        <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
          <h2 className="text-xl font-bold mb-4">Register Your Identity</h2>
          <p className="text-gray-300 mb-4">
            You need to register your identity to use the full features of the Decentralized Identity Manager.
          </p>
          <Link
            to="/dashboard/profile"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 inline-block"
          >
            Register Now
          </Link>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <div key={stat.name} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                  >
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <span className="text-3xl font-bold">{stat.value}</span>
                </div>
                <h3 className="text-gray-400">{stat.name}</h3>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {credentials.slice(0, 3).map((credential, i) => (
                <div key={i} className="flex items-center p-3 bg-gray-700/50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-blue-900/50 flex items-center justify-center mr-4">
                    <CreditCard className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium">{credential.isRevoked ? "Credential Revoked" : "Credential Issued"}</p>
                    <p className="text-sm text-gray-400">{credential.issuedAt}</p>
                  </div>
                </div>
              ))}
              {credentials.length === 0 && <div className="text-center py-4 text-gray-400">No recent activity</div>}
            </div>
          </div>
        </>
      )}

      {/* Quick Actions */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/dashboard/credentials"
            className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg flex items-center space-x-3 transition-colors"
          >
            <CreditCard className="h-5 w-5 text-blue-400" />
            <span>View My Credentials</span>
          </Link>
          {isIssuer && (
            <Link
              to="/dashboard/issue"
              className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg flex items-center space-x-3 transition-colors"
            >
              <FileCheck className="h-5 w-5 text-green-400" />
              <span>Issue New Credential</span>
            </Link>
          )}
          <Link
            to="/dashboard/profile"
            className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg flex items-center space-x-3 transition-colors"
          >
            <User className="h-5 w-5 text-purple-400" />
            <span>Update Profile</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

// Credentials Page
function CredentialsPage({ credentials, onRevokeCredential, account, refreshData }) {
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isRevoking, setIsRevoking] = useState(false)

  const filteredCredentials = credentials
    .filter((cred) => {
      if (filter === "valid") return !cred.isRevoked
      if (filter === "revoked") return cred.isRevoked
      return true
    })
    .filter((cred) => {
      if (!searchTerm) return true
      return cred.credentialHash.toLowerCase().includes(searchTerm.toLowerCase())
    })

  const handleRevokeCredential = async (index) => {
    try {
      setIsRevoking(true)
      await onRevokeCredential(account, index)
      await refreshData()
      setIsRevoking(false)
    } catch (error) {
      console.error("Error revoking credential:", error)
      setIsRevoking(false)
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Credentials</h1>
        <div className="relative">
          <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search credentials..."
            className="pl-10 pr-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          className={`px-4 py-2 ${filter === "all" ? "bg-blue-900/50 text-blue-400" : "bg-gray-700 hover:bg-gray-600"} rounded-lg`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`px-4 py-2 ${filter === "valid" ? "bg-blue-900/50 text-blue-400" : "bg-gray-700 hover:bg-gray-600"} rounded-lg`}
          onClick={() => setFilter("valid")}
        >
          Valid
        </button>
        <button
          className={`px-4 py-2 ${filter === "revoked" ? "bg-blue-900/50 text-blue-400" : "bg-gray-700 hover:bg-gray-600"} rounded-lg`}
          onClick={() => setFilter("revoked")}
        >
          Revoked
        </button>
      </div>

      {/* Credentials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredCredentials.length > 0 ? (
          filteredCredentials.map((credential) => (
            <div
              key={credential.id}
              className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-colors"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center`}
                  >
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      !credential.isRevoked ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"
                    }`}
                  >
                    {!credential.isRevoked ? "Valid" : "Revoked"}
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-2">Credential #{credential.id + 1}</h3>
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex justify-between">
                    <span>Hash:</span>
                    <span className="text-white truncate max-w-[150px]">{credential.credentialHash}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Issuer:</span>
                    <span className="text-white truncate max-w-[150px]">
                      {credential.issuer.substring(0, 6)}...{credential.issuer.substring(credential.issuer.length - 4)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Issued:</span>
                    <span className="text-white">{credential.issuedAt}</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-700 p-4 flex justify-between">
                <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">View Details</button>
                {!credential.isRevoked && (
                  <button
                    className="text-red-400 hover:text-red-300 text-sm font-medium"
                    onClick={() => handleRevokeCredential(credential.id)}
                    disabled={isRevoking}
                  >
                    {isRevoking ? "Revoking..." : "Revoke"}
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-12 bg-gray-800 rounded-xl border border-gray-700">
            <CreditCard className="h-12 w-12 mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">No Credentials Found</h3>
            <p className="text-gray-400">
              {searchTerm
                ? "No credentials match your search criteria"
                : filter !== "all"
                  ? `You don't have any ${filter} credentials`
                  : "You don't have any credentials yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// Issue Credential Page
function IssueCredentialPage({ onIssueCredential, storeCredentialData, refreshData }) {
  const [recipientAddress, setRecipientAddress] = useState("")
  const [credentialType, setCredentialType] = useState("Identity Verification")
  const [credentialName, setCredentialName] = useState("")
  const [credentialData, setCredentialData] = useState("")
  const [expiration, setExpiration] = useState("")
  const [isIssuing, setIsIssuing] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [recentlyIssued, setRecentlyIssued] = useState([])

  const handleIssueCredential = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      if (!recipientAddress || !credentialData) {
        setError("Recipient address and credential data are required")
        return
      }

      setIsIssuing(true)

      // Format the credential data
      const formattedData = {
        type: credentialType,
        name: credentialName,
        data: JSON.parse(credentialData),
        expiration: expiration || null,
        issuedAt: new Date().toISOString(),
      }

      // Store the credential data (e.g., on IPFS)
      const credentialHash = await storeCredentialData(formattedData)

      // Issue the credential on-chain
      await onIssueCredential(recipientAddress, credentialHash)

      // Update the recently issued list
      setRecentlyIssued([
        {
          recipient: recipientAddress,
          type: credentialType,
          issuedDate: new Date().toISOString().split("T")[0],
          status: "Valid",
          hash: credentialHash,
        },
        ...recentlyIssued,
      ])

      // Reset the form
      setRecipientAddress("")
      setCredentialName("")
      setCredentialData("")
      setExpiration("")

      setSuccess("Credential issued successfully")
      await refreshData()
      setIsIssuing(false)
    } catch (error) {
      console.error("Error issuing credential:", error)
      setError(error.message || "Failed to issue credential")
      setIsIssuing(false)
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Issue Credential</h1>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
        <h2 className="text-xl font-bold mb-6">Create New Credential</h2>

        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-900/30 border border-green-800 rounded-lg flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <p className="text-green-400">{success}</p>
          </div>
        )}

        <form onSubmit={handleIssueCredential} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Recipient Address</label>
            <input
              type="text"
              placeholder="0x..."
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Credential Type</label>
            <select
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={credentialType}
              onChange={(e) => setCredentialType(e.target.value)}
            >
              <option>Identity Verification</option>
              <option>Professional Certificate</option>
              <option>Academic Degree</option>
              <option>Membership</option>
              <option>Custom</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Credential Name</label>
            <input
              type="text"
              placeholder="e.g. Professional Certificate"
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={credentialName}
              onChange={(e) => setCredentialName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Credential Data (JSON)</label>
            <textarea
              rows={5}
              placeholder='{"name": "John Doe", "certification": "Blockchain Developer", ...}'
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={credentialData}
              onChange={(e) => setCredentialData(e.target.value)}
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Expiration (Optional)</label>
            <input
              type="date"
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={expiration}
              onChange={(e) => setExpiration(e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-6 py-2 border border-gray-600 rounded-lg hover:bg-gray-700"
              onClick={() => {
                setRecipientAddress("")
                setCredentialName("")
                setCredentialData("")
                setExpiration("")
                setError("")
                setSuccess("")
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg flex items-center"
              disabled={isIssuing}
            >
              {isIssuing ? (
                <>
                  <Loader className="animate-spin h-4 w-4 mr-2" />
                  Issuing...
                </>
              ) : (
                "Issue Credential"
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-6">Recently Issued</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-700">
                <th className="pb-3 font-medium">Recipient</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Issued Date</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {recentlyIssued.length > 0 ? (
                recentlyIssued.map((item, i) => (
                  <tr key={i} className="hover:bg-gray-700/50">
                    <td className="py-4">
                      {item.recipient.substring(0, 6)}...{item.recipient.substring(item.recipient.length - 4)}
                    </td>
                    <td className="py-4">{item.type}</td>
                    <td className="py-4">{item.issuedDate}</td>
                    <td className="py-4">
                      <span className="px-2 py-1 rounded-full bg-green-900/50 text-green-400 text-xs">Valid</span>
                    </td>
                    <td className="py-4">
                      <button className="text-blue-400 hover:text-blue-300 mr-3">View</button>
                      <button className="text-red-400 hover:text-red-300">Revoke</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">
                    No credentials issued recently
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Manage Issuers Page
function ManageIssuersPage({ onApproveIssuer, onRevokeIssuer, refreshData }) {
  const [issuers, setIssuers] = useState([
    { id: 1, address: "0x742...A1B2", name: "Identity Authority", status: "active", credentials: 145 },
    { id: 2, address: "0x123...45CD", name: "Academic Board", status: "active", credentials: 89 },
    { id: 3, address: "0x987...EF12", name: "Professional Association", status: "inactive", credentials: 56 },
    { id: 4, address: "0x456...789A", name: "Government Agency", status: "active", credentials: 212 },
  ])

  const [newIssuerAddress, setNewIssuerAddress] = useState("")
  const [newIssuerName, setNewIssuerName] = useState("")
  const [newIssuerType, setNewIssuerType] = useState("Educational Institution")
  const [newIssuerNotes, setNewIssuerNotes] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleApproveIssuer = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      if (!newIssuerAddress) {
        setError("Issuer address is required")
        return
      }

      setIsProcessing(true)

      // Call the contract function
      await onApproveIssuer(newIssuerAddress)

      // Update the issuers list
      const newIssuer = {
        id: issuers.length + 1,
        address: newIssuerAddress,
        name: newIssuerName || "Unknown",
        status: "active",
        credentials: 0,
      }

      setIssuers([...issuers, newIssuer])

      // Reset the form
      setNewIssuerAddress("")
      setNewIssuerName("")
      setNewIssuerType("Educational Institution")
      setNewIssuerNotes("")

      setSuccess("Issuer approved successfully")
      await refreshData()
      setIsProcessing(false)
    } catch (error) {
      console.error("Error approving issuer:", error)
      setError(error.message || "Failed to approve issuer")
      setIsProcessing(false)
    }
  }

  const handleToggleIssuerStatus = async (issuerId, currentStatus) => {
    try {
      setIsProcessing(true)

      const issuer = issuers.find((i) => i.id === issuerId)

      if (currentStatus === "active") {
        await onRevokeIssuer(issuer.address)
      } else {
        await onApproveIssuer(issuer.address)
      }

      // Update the issuers list
      const updatedIssuers = issuers.map((i) => {
        if (i.id === issuerId) {
          return {
            ...i,
            status: currentStatus === "active" ? "inactive" : "active",
          }
        }
        return i
      })

      setIssuers(updatedIssuers)
      await refreshData()
      setIsProcessing(false)
    } catch (error) {
      console.error("Error toggling issuer status:", error)
      setIsProcessing(false)
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Issuers</h1>
        <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Add Issuer</span>
        </button>
      </div>

      {/* Issuers Table */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-700">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Address</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Credentials Issued</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {issuers.map((issuer) => (
                <tr key={issuer.id} className="hover:bg-gray-700/50">
                  <td className="py-4">{issuer.name}</td>
                  <td className="py-4">{issuer.address}</td>
                  <td className="py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        issuer.status === "active" ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"
                      }`}
                    >
                      {issuer.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-4">{issuer.credentials}</td>
                  <td className="py-4">
                    <button className="text-blue-400 hover:text-blue-300 mr-3">Edit</button>
                    <button
                      className={
                        issuer.status === "active"
                          ? "text-red-400 hover:text-red-300"
                          : "text-green-400 hover:text-green-300"
                      }
                      onClick={() => handleToggleIssuerStatus(issuer.id, issuer.status)}
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Processing..." : issuer.status === "active" ? "Revoke" : "Approve"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Issuer Form */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-6">Add New Issuer</h2>

        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-900/30 border border-green-800 rounded-lg flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <p className="text-green-400">{success}</p>
          </div>
        )}

        <form onSubmit={handleApproveIssuer} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Issuer Address</label>
            <input
              type="text"
              placeholder="0x..."
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newIssuerAddress}
              onChange={(e) => setNewIssuerAddress(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Issuer Name (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Academic Institution"
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newIssuerName}
              onChange={(e) => setNewIssuerName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Issuer Type</label>
            <select
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newIssuerType}
              onChange={(e) => setNewIssuerType(e.target.value)}
            >
              <option>Educational Institution</option>
              <option>Government Agency</option>
              <option>Professional Organization</option>
              <option>Corporate Entity</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea
              rows={3}
              placeholder="Additional information about this issuer..."
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newIssuerNotes}
              onChange={(e) => setNewIssuerNotes(e.target.value)}
            ></textarea>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-6 py-2 border border-gray-600 rounded-lg hover:bg-gray-700"
              onClick={() => {
                setNewIssuerAddress("")
                setNewIssuerName("")
                setNewIssuerType("Educational Institution")
                setNewIssuerNotes("")
                setError("")
                setSuccess("")
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg flex items-center"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader className="animate-spin h-4 w-4 mr-2" />
                  Processing...
                </>
              ) : (
                "Approve Issuer"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Profile Page
function ProfilePage({ isRegistered, onRegisterIdentity, account, refreshData }) {
  const [profileName, setProfileName] = useState("")
  const [metadataUri, setMetadataUri] = useState("")
  const [isRegistering, setIsRegistering] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleRegisterIdentity = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      setIsRegistering(true)

      const metadata = {
        name: profileName || "Anonymous",
        createdAt: new Date().toISOString(),
        wallet: account,
      }

      // 2. Upload to Pinata
      const ipfsUri = await uploadMetadataToPinata(metadata)

      // 3. Call contract with ipfsUri
      await onRegisterIdentity(ipfsUri)

      setSuccess("Identity registered successfully")
      await refreshData()
      setIsRegistering(false)
    } catch (error) {
      console.error("Error registering identity:", error)
      setError(error.message || "Failed to register identity")
      setIsRegistering(false)
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      {!isRegistered ? (
        <form onSubmit={handleRegisterIdentity} className="space-y-6 bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold">Register Your Identity</h2>

          {error && (
            <div className="p-4 bg-red-900/30 border border-red-800 rounded flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-900/30 border border-green-800 rounded flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <p className="text-green-400">{success}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Profile Name</label>
            <input
              type="text"
              placeholder="e.g. Aravindh R"
              className="w-full px-4 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isRegistering}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white flex items-center"
            >
              {isRegistering ? (
                <>
                  <Loader className="animate-spin h-4 w-4 mr-2" />
                  Registering...
                </>
              ) : (
                "Register Identity"
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-gray-800 p-6 rounded border border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold">You’re Registered 🎉</h2>
              <p className="text-sm text-gray-400">Wallet: {account.slice(0, 6)}...{account.slice(-4)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Settings Page
function SettingsPage({ account }) {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
        <h2 className="text-xl font-bold mb-6">Application Settings</h2>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Dark Mode</h3>
              <p className="text-sm text-gray-400">Toggle between light and dark themes</p>
            </div>
            <div className="w-12 h-6 bg-blue-600 rounded-full relative">
              <div className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full"></div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Notifications</h3>
              <p className="text-sm text-gray-400">Receive alerts for new credentials and updates</p>
            </div>
            <div className="w-12 h-6 bg-blue-600 rounded-full relative">
              <div className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full"></div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Email Notifications</h3>
              <p className="text-sm text-gray-400">Receive email alerts</p>
            </div>
            <div className="w-12 h-6 bg-gray-600 rounded-full relative">
              <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full"></div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Language</label>
            <select className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
              <option>Chinese</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
        <h2 className="text-xl font-bold mb-6">Privacy Settings</h2>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Public Profile</h3>
              <p className="text-sm text-gray-400">Make your profile visible to others</p>
            </div>
            <div className="w-12 h-6 bg-blue-600 rounded-full relative">
              <div className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full"></div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Show Credentials</h3>
              <p className="text-sm text-gray-400">Display your credentials publicly</p>
            </div>
            <div className="w-12 h-6 bg-gray-600 rounded-full relative">
              <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full"></div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Data Analytics</h3>
              <p className="text-sm text-gray-400">Allow anonymous usage data collection</p>
            </div>
            <div className="w-12 h-6 bg-blue-600 rounded-full relative">
              <div className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-6">Security</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Connected Wallet</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={account}
                readOnly
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none"
              />
              <button className="px-4 py-2 bg-red-900/50 text-red-400 rounded-lg">Disconnect</button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-400">Add an extra layer of security</p>
            </div>
            <button className="px-4 py-2 bg-blue-900/50 text-blue-400 rounded-lg">Enable</button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Auto-Lock</h3>
              <p className="text-sm text-gray-400">Automatically lock after inactivity</p>
            </div>
            <select className="px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>5 minutes</option>
              <option>15 minutes</option>
              <option>30 minutes</option>
              <option>1 hour</option>
              <option>Never</option>
            </select>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <button className="px-4 py-2 bg-red-900/50 text-red-400 rounded-lg">Delete Account</button>
            <p className="text-xs text-gray-400 mt-1">
              This action cannot be undone. All your data will be permanently deleted.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
