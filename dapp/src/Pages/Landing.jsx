"use client"

import { useState, useEffect } from "react"
import "../App.css"
import { Link } from "react-router-dom"
function Landing() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState("")
  const [activeSection, setActiveSection] = useState("home")
  const [scrollY, setScrollY] = useState(0)
  const [showScrollTop, setShowScrollTop] = useState(false)
  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
      setShowScrollTop(window.scrollY > 500)
      // Determine active section based on scroll position
      const sections = ["home", "features", "how-it-works", "about"]
      const sectionElements = sections.map((id) => document.getElementById(id))
      const currentSection = sectionElements.reduce((acc, section) => {
        if (!section) return acc
        const rect = section.getBoundingClientRect()
        if (rect.top <= 100 && rect.bottom >= 100) {
          return section.id
        }
        return acc
      }, "home")
      setActiveSection(currentSection)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      window.scrollTo({ top: element.offsetTop - 80, behavior: "smooth" })
    }
    setActiveSection(sectionId)
  }
  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        setIsConnecting(true)
        // Request account access
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
        setAccount(accounts[0])
        setIsConnected(true)
        setIsConnecting(false)
        // Store connected account in local storage for persistence
        localStorage.setItem("connectedAccount", accounts[0])
        // You can redirect to the main app here or show different content
      } catch (error) {
        console.error("User denied account access")
        setIsConnecting(false)
      }
    } else {
      alert("MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html")
    }
  }
  // Check if user was previously connected
  useEffect(() => {
    const checkConnection = async () => {
      const savedAccount = localStorage.getItem("connectedAccount")
      if (savedAccount && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" })
          if (accounts.length > 0) {
            setAccount(accounts[0])
            setIsConnected(true)
          }
        } catch (error) {
          console.error("Error checking connection:", error)
        }
      }
    }
    checkConnection()
  }, [])
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      {" "}
      {/* Navbar - with glass effect and scroll animation */}{" "}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center transition-all duration-300 ${scrollY > 50 ? "bg-gray-900/90 backdrop-blur-md shadow-lg" : "bg-transparent"}`}
      >
        {" "}
        <div className="flex items-center space-x-3">
          {" "}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group">
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 group-hover:scale-110 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
              />{" "}
            </svg>{" "}
          </div>{" "}
          <div>
            {" "}
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              DIM
            </span>{" "}
            <div className="text-xs text-blue-300 -mt-1">Decentralized Identity Manager</div>{" "}
          </div>{" "}
        </div>{" "}
        {/* Navigation Links */}
        <div className="hidden md:flex space-x-8">
          {" "}
          <button
            onClick={() => scrollToSection("home")}
            className={`text-sm font-medium hover:text-blue-400 transition-colors relative ${activeSection === "home" ? "text-blue-400" : "text-gray-300"}`}
          >
            {" "}
            Home{" "}
            {activeSection === "home" && (
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-400 rounded-full"></span>
            )}{" "}
          </button>{" "}
          <button
            onClick={() => scrollToSection("features")}
            className={`text-sm font-medium hover:text-blue-400 transition-colors relative ${activeSection === "features" ? "text-blue-400" : "text-gray-300"}`}
          >
            {" "}
            Features{" "}
            {activeSection === "features" && (
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-400 rounded-full"></span>
            )}{" "}
          </button>{" "}
          <div className="flex space-x-6">
            {" "}
           
         
          </div>{" "}
        </div>
        {/* Connect Wallet Button */}
        <div>
          {" "}
          {!isConnected ? (
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2.5 px-5 rounded-lg transition-all duration-300 flex items-center shadow-lg shadow-blue-700/30 hover:shadow-blue-700/50"
            >
              {" "}
              {isConnecting ? (
                <>
                  {" "}
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    {" "}
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>{" "}
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>{" "}
                  </svg>{" "}
                  Connecting...{" "}
                </>
              ) : (
                <>
                  {" "}
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {" "}
                    <path
                      fillRule="evenodd"
                      d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z"
                      clipRule="evenodd"
                    />{" "}
                  </svg>{" "}
                  Connect Wallet{" "}
                </>
              )}{" "}
            </button>
          ) : (
            <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-800 to-purple-800 py-2.5 px-5 rounded-lg shadow-lg">
              {" "}
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>{" "}
              <span className="text-sm font-medium">
                {" "}
                {account.substring(0, 6)}...{account.substring(account.length - 4)}{" "}
              </span>{" "}
            </div>
          )}{" "}
        </div>{" "}
      </nav>{" "}
      {/* Hero Section with animated elements */}{" "}
      <div
        id="home"
        className="container mx-auto px-6 pt-32 pb-16 text-center min-h-screen flex flex-col justify-center items-center"
      >
        {" "}
        {/* Animated background elements */}{" "}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {" "}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>{" "}
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>{" "}
          <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>{" "}
        </div>{" "}
        <div className="relative z-10">
          {" "}
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight">
            {" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 inline-block">
              Decentralized Identity
            </span>{" "}
            <br /> <span className="inline-block mt-2">for the Modern Web</span>{" "}
          </h1>{" "}
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-10 leading-relaxed">
            {" "}
            Take control of your digital identity with our secure, blockchain-based identity management system. Own your
            data, control your privacy, and seamlessly authenticate across the web3 ecosystem.{" "}
          </p>{" "}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            {" "}
            {!isConnected ? (
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-semibold py-4 px-10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden"
              >
                {" "}
                <span className="relative z-10">{isConnecting ? "Connecting..." : "Connect MetaMask"}</span>{" "}
                <span className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 bluetransition-opacity duration-300 transform scale-x-0 group-hover:scale-x-100 origin-left"></span>{" "}
              </button>
            ) : (
              <Link
                to="/dashboard"
                className="group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-lg font-semibold py-4 px-10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden"
              >
                <span className="relative z-10">Enter Dashboard</span>
                <span className="absolute inset-0 h-full w-full bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-x-0 group-hover:scale-x-100 origin-left"></span>
              </Link>
            )}{" "}
            <button className="group bg-transparent border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-gray-900 text-lg font-semibold py-4 px-10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
              {" "}
              <span className="relative z-10">Learn More</span>{" "}
              <span className="absolute inset-0 h-full w-full bg--400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-x-0 group-hover:scale-x-100 origin-left"></span>{" "}
            </button>{" "}
          </div>
          {/* Animated scroll indicator */}{" "}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce">
            {" "}
            <span className="text-sm text-blue-300 mb-2">Scroll to explore</span>{" "}
            <svg
              className="w-6 h-6 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              ></path>{" "}
            </svg>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* Feature Cards Section */}{" "}
      <div id="features" className="container mx-auto px-6 py-20">
        {" "}
        <div className="text-center mb-16">
          {" "}
          <h2 className="text-4xl font-bold mb-4">
            {" "}
            Why Choose{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">DIM</span>{" "}
          </h2>{" "}
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            {" "}
            Our decentralized identity platform offers unique advantages that put you in control of your digital
            presence.{" "}
          </p>{" "}
        </div>{" "}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {" "}
          <div className="bg-gray-800 bg-opacity-50 p-8 rounded-xl border border-blue-800 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
            {" "}
            <div className="w-16 h-16 mx-auto bg-blue-600 rounded-full flex items-center justify-center mb-6">
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />{" "}
              </svg>{" "}
            </div>{" "}
            <h3 className="text-xl font-bold mb-3">Self-Sovereign Identity</h3>{" "}
            <p className="text-blue-200">
              Own your identity credentials and control who has access to your personal information.
            </p>{" "}
          </div>{" "}
          <div className="bg-gray-800 bg-opacity-50 p-8 rounded-xl border border-blue-800 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
            {" "}
            <div className="w-16 h-16 mx-auto bg-purple-600 rounded-full flex items-center justify-center mb-6">
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />{" "}
              </svg>{" "}
            </div>{" "}
            <h3 className="text-xl font-bold mb-3">Blockchain Security</h3>{" "}
            <p className="text-blue-200">
              Your identity is secured by the same technology that powers cryptocurrencies.
            </p>{" "}
          </div>{" "}
          <div className="bg-gray-800 bg-opacity-50 p-8 rounded-xl border border-blue-800 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
            {" "}
            <div className="w-16 h-16 mx-auto bg-green-600 rounded-full flex items-center justify-center mb-6">
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />{" "}
              </svg>{" "}
            </div>{" "}
            <h3 className="text-xl font-bold mb-3">Seamless Integration</h3>{" "}
            <p className="text-blue-200">
              Connect with dApps and web3 services with a single click, no passwords needed.
            </p>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* How It Works Section */}{" "}
      <div className="bg-gray-800 bg-opacity-30 py-16">
        {" "}
        <div className="container mx-auto px-6">
          {" "}
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>{" "}
          <div className="flex flex-col md:flex-row justify-between items-center max-w-5xl mx-auto">
            {" "}
            <div className="flex flex-col items-center text-center mb-8 md:mb-0 md:w-1/4">
              {" "}
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4 relative">
                {" "}
                <span className="text-xl font-bold">1</span>{" "}
                <div className="hidden md:block absolute top-1/2 left-full h-1 bg-blue-600 w-full transform -translate-y-1/2"></div>{" "}
              </div>{" "}
              <h3 className="text-lg font-semibold mb-2">Connect Wallet</h3>{" "}
              <p className="text-blue-200 text-sm">
                Link your MetaMask wallet to create your decentralized identity.
              </p>{" "}
            </div>{" "}
            <div className="flex flex-col items-center text-center mb-8 md:mb-0 md:w-1/4">
              {" "}
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4 relative">
                {" "}
                <span className="text-xl font-bold">2</span>{" "}
                <div className="hidden md:block absolute top-1/2 left-full h-1 bg-blue-600 w-full transform -translate-y-1/2"></div>{" "}
              </div>{" "}
              <h3 className="text-lg font-semibold mb-2">Create Profile</h3>{" "}
              <p className="text-blue-200 text-sm">
                Set up your identity with the information you choose to share.
              </p>{" "}
            </div>{" "}
            <div className="flex flex-col items-center text-center mb-8 md:mb-0 md:w-1/4">
              {" "}
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4 relative">
                {" "}
                <span className="text-xl font-bold">3</span>{" "}
                <div className="hidden md:block absolute top-1/2 left-full h-1 bg-blue-600 w-full transform -translate-y-1/2"></div>{" "}
              </div>{" "}
              <h3 className="text-lg font-semibold mb-2">Verify Identity</h3>{" "}
              <p className="text-blue-200 text-sm">
                Add credentials and verifications to strengthen your digital identity.
              </p>{" "}
            </div>{" "}
            <div className="flex flex-col items-center text-center md:w-1/4">
              {" "}
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                {" "}
                <span className="text-xl font-bold">4</span>{" "}
              </div>{" "}
              <h3 className="text-lg font-semibold mb-2">Use Anywhere</h3>{" "}
              <p className="text-blue-200 text-sm">
                Seamlessly authenticate across the web3 ecosystem with your identity.
              </p>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* CTA Section */}{" "}
      <div className="container mx-auto px-6 py-16 text-center">
        {" "}
        <div className="bg-gradient-to-r from-blue-800 to-purple-800 rounded-2xl p-10 max-w-4xl mx-auto shadow-xl">
          {" "}
          <h2 className="text-3xl font-bold mb-4">Ready to take control of your digital identity?</h2>{" "}
          <p className="text-xl text-blue-100 mb-8">
            {" "}
            Join thousands of users who have already embraced decentralized identity management.{" "}
          </p>{" "}
          {!isConnected ? (
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className="bg-white text-blue-900 hover:bg-blue-100 text-lg font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {" "}
              {isConnecting ? "Connecting..." : "Connect MetaMask & Get Started"}{" "}
            </button>
          ) : (
            <Link
              to="/dashboard"
              className="bg-white text-blue-900 hover:bg-blue-100 text-lg font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Enter Dashboard
            </Link>
          )}{" "}
        </div>{" "}
      </div>{" "}
      {/* Footer */}{" "}
      <footer className="bg-gray-900 py-8 border-t border-blue-900">
        {" "}
        <div className="container mx-auto px-6">
          {" "}
          <div className="flex flex-col md:flex-row justify-between items-center">
            {" "}
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              {" "}
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {" "}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                  />{" "}
                </svg>{" "}
              </div>{" "}
              <span className="text-lg font-bold">DIM</span>{" "}
            </div>{" "}
            <div className="flex space-x-6">
              {" "}
              <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                {" "}
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  {" "}
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />{" "}
                </svg>{" "}
              </a>{" "}
              <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                {" "}
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  {" "}
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />{" "}
                </svg>{" "}
              </a>{" "}
              <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                {" "}
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  {" "}
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
                    clipRule="evenodd"
                  />{" "}
                </svg>{" "}
              </a>{" "}
            </div>{" "}
          </div>{" "}
          <div className="mt-8 text-center text-sm text-gray-500">
            {" "}
            <p>© 2025 Decentralized Identity Manager. All rights reserved.</p>{" "}
            <div className="flex justify-center space-x-4 mt-2">
              {" "}
              <a href="#" className="hover:text-blue-400 transition-colors">
                {" "}
                Privacy Policy{" "}
              </a>{" "}
              <a href="#" className="hover:text-blue-400 transition-colors">
                {" "}
                Terms of Service{" "}
              </a>{" "}
              <a href="#" className="hover:text-blue-400 transition-colors">
                {" "}
                Contact{" "}
              </a>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </footer>{" "}
    </div>
  )
}
export default Landing
