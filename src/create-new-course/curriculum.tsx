import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCourse } from '../contexts/CourseContext'
import type { SectionMaterial } from '../contexts/CourseContext'
import LogoImg from '../accesory/picture/StudyMate 1.png'

const NavItem: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <a
      href="#"
      className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
    >
      {children}
    </a>
  )
}

const Step: React.FC<{
  number: number
  title: string
  active?: boolean
  completed?: boolean
}> = ({ number, title, active = false, completed = false }) => {
  return (
    <div className="flex flex-col items-center relative z-10">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
          active
            ? 'bg-[#1976d2] text-white ring-4 ring-blue-100'
            : completed
            ? 'bg-green-500 text-white'
            : 'bg-slate-200 text-slate-500'
        }`}
      >
        {completed ? <i className="fa-solid fa-check"></i> : number}
      </div>
      <div
        className={`mt-2 text-[10px] font-medium uppercase tracking-wide ${
          active ? 'text-[#1976d2]' : 'text-slate-500'
        }`}
      >
        {title}
      </div>
    </div>
  )
}

const Curriculum: React.FC = () => {
  const { user, logout } = useAuth()
  const { courseData, updateCourseData } = useCourse()
  const currentStep: number = 2

  // Temporary state for the new section input
  const [newSectionTitle, setNewSectionTitle] = useState('')
  const [newSectionDescription, setNewSectionDescription] = useState('')

  // State for new material
  const [newMaterial, setNewMaterial] = useState<Partial<SectionMaterial>>({
    title: '',
    description: '',
    materialType: 'video',
    fileUrl: '',
    fileName: ''
  })
  
  // Track which section we are adding material to
  const [activeSectionIndex, setActiveSectionIndex] = useState<number | null>(null)

  const [editingSectionIndex, setEditingSectionIndex] = useState<number | null>(null)
  const [editedSectionTitle, setEditedSectionTitle] = useState('')
  const [editedSectionDescription, setEditedSectionDescription] = useState('')

  const [editingMaterial, setEditingMaterial] = useState<{sectionIndex: number, materialIndex: number} | null>(null)
  const [editedMaterialState, setEditedMaterialState] = useState<Partial<SectionMaterial>>({})

  const startEditingMaterial = (sectionIndex: number, materialIndex: number) => {
    const material = courseData.sections[sectionIndex].materials[materialIndex]
    setEditingMaterial({ sectionIndex, materialIndex })
    setEditedMaterialState({ ...material })
  }

  const saveEditedMaterial = () => {
    if (!editingMaterial) return
    const { sectionIndex, materialIndex } = editingMaterial
    
    const updatedSections = [...courseData.sections]
    const updatedMaterials = [...updatedSections[sectionIndex].materials]
    
    updatedMaterials[materialIndex] = {
      ...updatedMaterials[materialIndex],
      ...editedMaterialState
    } as SectionMaterial

    updatedSections[sectionIndex].materials = updatedMaterials
    updateCourseData({ sections: updatedSections })
    setEditingMaterial(null)
    setEditedMaterialState({})
  }

  const deleteMaterial = (sectionIndex: number, materialIndex: number) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      const updatedSections = [...courseData.sections]
      const updatedMaterials = updatedSections[sectionIndex].materials.filter((_, i) => i !== materialIndex)
      
      // Re-order indexes
      updatedMaterials.forEach((m, i) => m.orderIndex = i + 1)
      
      updatedSections[sectionIndex].materials = updatedMaterials
      updateCourseData({ sections: updatedSections })
    }
  }

  const handleAddSection = () => {
    if (!newSectionTitle.trim()) return

    const newSection = {
      title: newSectionTitle,
      description: newSectionDescription,
      orderIndex: courseData.sections.length + 1,
      materials: []
    }

    updateCourseData({
      sections: [...courseData.sections, newSection]
    })
    setNewSectionTitle('')
    setNewSectionDescription('')
  }

  const handleAddMaterial = (sectionIndex: number) => {
    if (!newMaterial.title || !newMaterial.fileUrl) return

    const updatedSections = [...courseData.sections]
    const currentSection = updatedSections[sectionIndex]
    
    // Auto-detect file type based on fileUrl if materialType is default
    let detectedType = newMaterial.materialType || 'other'
    if (newMaterial.fileUrl) {
      if (newMaterial.fileUrl.endsWith('.mp4') || newMaterial.fileUrl.endsWith('.webm')) detectedType = 'video'
      else if (newMaterial.fileUrl.endsWith('.pdf')) detectedType = 'pdf'
      else if (newMaterial.fileUrl.match(/\.(jpeg|jpg|gif|png)$/)) detectedType = 'image'
    }

    const material: SectionMaterial = {
      title: newMaterial.title || '',
      description: newMaterial.description || '',
      materialType: detectedType,
      fileUrl: newMaterial.fileUrl || '',
      fileName: newMaterial.fileName || newMaterial.fileUrl?.split('/').pop() || 'file',
      fileSize: 0, // In a real app, this would come from the file upload
      orderIndex: currentSection.materials.length + 1
    }

    currentSection.materials.push(material)
    
    updateCourseData({ sections: updatedSections })
    
    // Reset form
    setNewMaterial({
      title: '',
      description: '',
      materialType: 'video',
      fileUrl: '',
      fileName: ''
    })
    setActiveSectionIndex(null)
  }

  const startEditingSection = (index: number) => {
    setEditingSectionIndex(index)
    setEditedSectionTitle(courseData.sections[index].title)
    setEditedSectionDescription(courseData.sections[index].description)
  }

  const saveEditedSection = (index: number) => {
    const updatedSections = [...courseData.sections]
    updatedSections[index] = {
      ...updatedSections[index],
      title: editedSectionTitle,
      description: editedSectionDescription
    }
    updateCourseData({ sections: updatedSections })
    setEditingSectionIndex(null)
  }

  const deleteSection = (index: number) => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      const updatedSections = courseData.sections.filter((_, i) => i !== index)
      // Re-order indexes
      const reorderedSections = updatedSections.map((sec, i) => ({
        ...sec,
        orderIndex: i + 1
      }))
      updateCourseData({ sections: reorderedSections })
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Top nav - Simplified Version */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4">
          <div className="h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img
                src={LogoImg}
                alt="StudyMate Logo"
                className="h-10 w-auto object-contain"
              />
              <span className="text-xl font-semibold tracking-tight text-[#1976d2]">
                StudyMate
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-7">
              <Link to="/" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                Home
              </Link>
              <NavItem>Courses</NavItem>
              <NavItem>AI Tutor</NavItem>
              <NavItem>Game</NavItem>
              <NavItem>Community</NavItem>
            </nav>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="hidden sm:inline-flex items-center justify-center h-9 w-9 rounded-full bg-[#e3f2fd] text-[#1976d2] border border-[#bbdefb]"
                aria-label="Search"
              >
                <span className="text-sm">⌕</span>
              </button>
              <Link
                to="/membership"
                className="hidden sm:inline-flex items-center gap-2 rounded-md border border-[#bbdefb] bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <span className="text-sm">♛</span>
                Upgrade
              </Link>
              <div className="flex items-center gap-3">
                  <Link to="/profile" className="flex items-center gap-3 group">
                    <div className="hidden md:flex flex-col items-end mr-2">
                      <span className="text-sm font-semibold text-slate-900 group-hover:text-[#1976d2] transition-colors">
                        {user?.fullName || 'Teacher'}
                      </span>
                      <span className="text-[10px] text-slate-500 capitalize">
                        {user?.role || 'Lecturer'}
                      </span>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-[#1976d2] flex items-center justify-center text-white cursor-pointer group-hover:bg-[#1565c0] transition-colors">
                      <span className="font-semibold text-xs">
                        {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'T'}
                      </span>
                    </div>
                  </Link>
                  <button
                    onClick={() => logout()}
                    className="text-xs font-medium text-slate-500 hover:text-red-600 transition-colors ml-1"
                  >
                    Logout
                  </button>
                </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10">
        <Link 
          to="/create-new-course" 
          className="inline-flex items-center gap-2 text-sm font-medium text-white bg-[#1976d2] px-4 py-2 rounded-md hover:bg-[#1565c0] transition-colors mb-8 shadow-sm"
        >
          <i className="fa-solid fa-arrow-left"></i> Back to Basic Info
        </Link>

        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-slate-900">Create New Course</h1>
          <p className="mt-2 text-slate-600">Follow the steps to create your course</p>
        </div>

        {/* Stepper */}
        <div className="mb-12 relative">
          <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-200 -z-0"></div>
          <div className="flex justify-between relative px-4">
            <Step number={1} title="Basic Info" active={currentStep === 1} completed={currentStep > 1} />
            <Step number={2} title="Curriculum" active={currentStep === 2} completed={currentStep > 2} />
            <Step number={3} title="Quiz Setup" active={currentStep === 3} completed={currentStep > 3} />
            <Step number={4} title="Flashcards" active={currentStep === 4} completed={currentStep > 4} />
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Course Curriculum</h2>
          <p className="text-sm text-slate-600 mb-6">Add sections and lessons to your course</p>
          
          <div className="space-y-6">
            {courseData.sections.map((section, index) => (
              <div key={index} className="border border-slate-200 rounded-lg p-6 bg-slate-50">
                <div className="flex justify-between items-start mb-4">
                  {editingSectionIndex === index ? (
                    <div className="flex-1 mr-4 space-y-2">
                      <input
                        type="text"
                        className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-[#1976d2] font-bold"
                        value={editedSectionTitle}
                        onChange={(e) => setEditedSectionTitle(e.target.value)}
                      />
                      <input
                        type="text"
                        className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-[#1976d2]"
                        value={editedSectionDescription}
                        onChange={(e) => setEditedSectionDescription(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <button 
                          onClick={() => saveEditedSection(index)}
                          className="px-3 py-1 text-xs font-bold text-white bg-green-500 rounded hover:bg-green-600"
                        >
                          Save
                        </button>
                        <button 
                          onClick={() => setEditingSectionIndex(null)}
                          className="px-3 py-1 text-xs font-medium text-slate-500 hover:text-slate-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">{section.title}</h3>
                      <p className="text-sm text-slate-500">{section.description}</p>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      Section {section.orderIndex}
                    </span>
                    <button 
                      onClick={() => startEditingSection(index)}
                      className="text-slate-400 hover:text-[#1976d2] transition-colors"
                      title="Edit Section"
                    >
                      <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button 
                      onClick={() => deleteSection(index)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                      title="Delete Section"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>

                {/* List Materials */}
                <div className="space-y-3 mb-4 pl-4 border-l-2 border-slate-200">
                  {section.materials.map((material, mIndex) => (
                    <div key={mIndex} className="bg-white p-3 rounded border border-slate-200">
                      {editingMaterial?.sectionIndex === index && editingMaterial?.materialIndex === mIndex ? (
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                              type="text"
                              className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1976d2]"
                              value={editedMaterialState.title}
                              onChange={(e) => setEditedMaterialState({...editedMaterialState, title: e.target.value})}
                              placeholder="Title"
                            />
                            <select
                              className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1976d2] bg-white"
                              value={editedMaterialState.materialType}
                              onChange={(e) => setEditedMaterialState({...editedMaterialState, materialType: e.target.value})}
                            >
                              <option value="video">Video</option>
                              <option value="pdf">PDF</option>
                              <option value="image">Image</option>
                            </select>
                            <input
                              type="text"
                              className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1976d2]"
                              value={editedMaterialState.fileUrl}
                              onChange={(e) => setEditedMaterialState({...editedMaterialState, fileUrl: e.target.value})}
                              placeholder="File URL"
                            />
                            <input
                              type="text"
                              className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1976d2]"
                              value={editedMaterialState.fileName}
                              onChange={(e) => setEditedMaterialState({...editedMaterialState, fileName: e.target.value})}
                              placeholder="File Name"
                            />
                            <input
                              type="text"
                              className="md:col-span-2 rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1976d2]"
                              value={editedMaterialState.description}
                              onChange={(e) => setEditedMaterialState({...editedMaterialState, description: e.target.value})}
                              placeholder="Description"
                            />
                          </div>
                          <div className="flex gap-2 justify-end">
                            <button 
                              onClick={() => setEditingMaterial(null)}
                              className="px-3 py-1 text-xs font-medium text-slate-500 hover:text-slate-700"
                            >
                              Cancel
                            </button>
                            <button 
                              onClick={saveEditedMaterial}
                              className="px-3 py-1 text-xs font-bold text-white bg-green-500 rounded hover:bg-green-600"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="flex items-center gap-2">
                              <i className={`fa-solid ${material.materialType === 'video' ? 'fa-video' : 'fa-file-pdf'} text-slate-400`}></i>
                              <span className="text-sm font-medium text-slate-700">{material.title}</span>
                            </div>
                            <p className="text-xs text-slate-500 ml-6">{material.description}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-400">{material.materialType}</span>
                            <div className="flex gap-1">
                              <button 
                                onClick={() => startEditingMaterial(index, mIndex)}
                                className="text-slate-400 hover:text-[#1976d2] p-1"
                                title="Edit Material"
                              >
                                <i className="fa-solid fa-pen"></i>
                              </button>
                              <button 
                                onClick={() => deleteMaterial(index, mIndex)}
                                className="text-slate-400 hover:text-red-500 p-1"
                                title="Delete Material"
                              >
                                <i className="fa-solid fa-xmark"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add Material Button/Form */}
                {activeSectionIndex === index ? (
                  <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm mt-4">
                    <h4 className="text-sm font-bold text-slate-700 mb-3">Add Material</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <input
                        type="text"
                        placeholder="Material Title"
                        className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1976d2]"
                        value={newMaterial.title}
                        onChange={(e) => setNewMaterial({...newMaterial, title: e.target.value})}
                      />
                      <select
                        className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1976d2] bg-white"
                        value={newMaterial.materialType}
                        onChange={(e) => setNewMaterial({...newMaterial, materialType: e.target.value})}
                      >
                        <option value="video">Video</option>
                        <option value="pdf">PDF</option>
                        <option value="image">Image</option>
                      </select>
                      <input
                        type="text"
                        placeholder="File URL"
                        className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1976d2]"
                        value={newMaterial.fileUrl}
                        onChange={(e) => setNewMaterial({...newMaterial, fileUrl: e.target.value})}
                      />
                      <input
                        type="text"
                        placeholder="File Name (e.g. intro.mp4)"
                        className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1976d2]"
                        value={newMaterial.fileName}
                        onChange={(e) => setNewMaterial({...newMaterial, fileName: e.target.value})}
                      />
                      <input
                        type="text"
                        placeholder="Description"
                        className="md:col-span-2 rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1976d2]"
                        value={newMaterial.description}
                        onChange={(e) => setNewMaterial({...newMaterial, description: e.target.value})}
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button 
                        onClick={() => setActiveSectionIndex(null)}
                        className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => handleAddMaterial(index)}
                        className="px-3 py-1.5 text-xs font-bold text-white bg-[#1976d2] rounded hover:bg-[#1565c0]"
                      >
                        Save Material
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => setActiveSectionIndex(index)}
                    className="text-xs font-semibold text-[#1976d2] hover:underline flex items-center gap-1 mt-2"
                  >
                    <i className="fa-solid fa-plus"></i> Add Material
                  </button>
                )}
              </div>
            ))}

            <div className="border-t border-slate-200 pt-6">
              <h3 className="font-bold text-slate-800 mb-3">Add New Section</h3>
              <div className="grid grid-cols-1 gap-3">
                <input
                  type="text"
                  placeholder="Section Title (e.g. Introduction)"
                  className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-[#1976d2] focus:ring-1 focus:ring-[#1976d2] outline-none transition-all"
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Section Description"
                  className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-[#1976d2] focus:ring-1 focus:ring-[#1976d2] outline-none transition-all"
                  value={newSectionDescription}
                  onChange={(e) => setNewSectionDescription(e.target.value)}
                />
                <button 
                  onClick={handleAddSection}
                  className="py-2.5 px-4 bg-[#1976d2] text-white rounded-lg font-medium hover:bg-[#1565c0] transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <i className="fa-solid fa-plus"></i> Create Section
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <Link
              to="/create-new-course"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-6 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <i className="fa-solid fa-arrow-left"></i> Previous
            </Link>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg bg-[#1976d2] px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-[#1565c0] transition-colors"
            >
              <Link to="/create-new-course/quiz-setup">
                Next <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Curriculum
