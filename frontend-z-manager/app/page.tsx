'use client'
import React from 'react'

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto p-8 font-inter text-white">
      <header className="text-center mb-12">
        <h1 className="text-5xl text-white mb-2">Welcome to Z-Manager</h1>
        <p className="text-xl text-gray-300">Organize Your Life, Maximize Your Productivity</p>
      </header>
      
      <main className="flex justify-center">
        <section className="flex items-center gap-8">
          <div className="flex-1">
            <h2 className="text-4xl text-white mb-4">Plan Smarter, Achieve More</h2>
            <p className="text-base text-gray-300 mb-6">Z-Manager helps you streamline your tasks, schedule your day, and reach your goals with ease.</p>
            <button className="px-6 py-3 text-base text-black bg-blue-500 rounded-md cursor-pointer transition-colors duration-300 hover:bg-blue-600">
              Get Started
            </button>
          </div>
          <div className="flex-1">
            <div className="bg-gray-800 h-[300px] flex items-center justify-center rounded-lg text-white text-xl">
              <span>App Screenshot</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
