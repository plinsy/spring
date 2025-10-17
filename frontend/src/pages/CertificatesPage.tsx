import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Award, Download, Share2, Calendar, BookOpen, CheckCircle, ExternalLink, Printer } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { ROUTES, API } from '../lib/urls'
import api from '../lib/axios'

interface Certificate {
  id: number
  certificateCode: string
  certificateUrl: string
  issuedAt: string
  enrollment: {
    id: number
    completedAt: string
    course: {
      id: number
      title: string
      instructor: {
        firstName: string
        lastName: string
      }
      thumbnailUrl: string
    }
  }
}

export default function CertificatesPage() {
  const { user } = useAuthStore()
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null)

  useEffect(() => {
    fetchCertificates()
  }, [])

  const fetchCertificates = async () => {
    try {
      setLoading(true)
      const response = await api.get(API.CERTIFICATES.MY)
      setCertificates(response.data.data || [])
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load certificates')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (certificate: Certificate) => {
    try {
      // In a real app, this would download the PDF certificate
      window.open(certificate.certificateUrl, '_blank')
    } catch (err) {
      console.error('Download failed:', err)
    }
  }

  const handleShare = (certificate: Certificate) => {
    const shareUrl = `${window.location.origin}/certificates/verify/${certificate.certificateCode}`
    
    if (navigator.share) {
      navigator.share({
        title: `Certificate - ${certificate.enrollment.course.title}`,
        text: `I earned a certificate for completing ${certificate.enrollment.course.title}!`,
        url: shareUrl,
      }).catch(console.error)
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareUrl)
      alert('Certificate link copied to clipboard!')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">My Certificates</h1>
          </div>
          <p className="text-gray-600">
            View and share your earned certificates of completion
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 rounded-lg p-3">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{certificates.length}</p>
                <p className="text-sm text-gray-600">Total Certificates</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 rounded-lg p-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{certificates.length}</p>
                <p className="text-sm text-gray-600">Courses Completed</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 rounded-lg p-3">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {certificates.length > 0 
                    ? new Date(certificates[certificates.length - 1].issuedAt).getFullYear()
                    : new Date().getFullYear()
                  }
                </p>
                <p className="text-sm text-gray-600">Latest Achievement</p>
              </div>
            </div>
          </div>
        </div>

        {/* Certificates Grid */}
        {certificates.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Award className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Certificates Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Complete courses to earn certificates and showcase your achievements!
            </p>
            <Link
              to={ROUTES.COURSES}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((certificate) => (
              <div
                key={certificate.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Certificate Preview */}
                <div className="relative h-48 bg-gradient-to-br from-blue-600 to-purple-600 p-6 flex flex-col justify-between">
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    <p className="text-white text-xs font-medium">Verified</p>
                  </div>
                  
                  <div>
                    <Award className="w-12 h-12 text-white/80 mb-2" />
                    <p className="text-white/80 text-sm font-medium mb-1">Certificate of Completion</p>
                    <h3 className="text-white font-bold text-lg line-clamp-2">
                      {certificate.enrollment.course.title}
                    </h3>
                  </div>
                  
                  <div className="text-white/90 text-sm">
                    <p>{user?.firstName} {user?.lastName}</p>
                  </div>
                </div>

                {/* Certificate Details */}
                <div className="p-6">
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Issued on {formatDate(certificate.issuedAt)}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <BookOpen className="w-4 h-4 mr-2" />
                      <span>
                        Instructor: {certificate.enrollment.course.instructor.firstName}{' '}
                        {certificate.enrollment.course.instructor.lastName}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span className="font-mono text-xs">ID: {certificate.certificateCode}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownload(certificate)}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </button>
                    
                    <button
                      onClick={() => handleShare(certificate)}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </button>
                    
                    <button
                      onClick={() => setSelectedCertificate(certificate)}
                      className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Certificate Modal */}
        {selectedCertificate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Certificate Preview</h2>
                <button
                  onClick={() => setSelectedCertificate(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>

              {/* Certificate Content */}
              <div className="p-8">
                <div className="border-8 border-blue-600 rounded-lg p-12 text-center">
                  <Award className="w-20 h-20 text-blue-600 mx-auto mb-6" />
                  
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">
                    Certificate of Completion
                  </h3>
                  
                  <p className="text-gray-600 mb-8">This is to certify that</p>
                  
                  <p className="text-4xl font-bold text-blue-600 mb-8">
                    {user?.firstName} {user?.lastName}
                  </p>
                  
                  <p className="text-gray-600 mb-4">has successfully completed</p>
                  
                  <p className="text-2xl font-bold text-gray-900 mb-8">
                    {selectedCertificate.enrollment.course.title}
                  </p>
                  
                  <p className="text-gray-600 mb-2">
                    Instructed by {selectedCertificate.enrollment.course.instructor.firstName}{' '}
                    {selectedCertificate.enrollment.course.instructor.lastName}
                  </p>
                  
                  <p className="text-gray-600 mb-8">
                    on {formatDate(selectedCertificate.issuedAt)}
                  </p>
                  
                  <div className="border-t border-gray-300 pt-6 mt-8">
                    <p className="text-sm text-gray-500 font-mono">
                      Certificate ID: {selectedCertificate.certificateCode}
                    </p>
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => handleDownload(selectedCertificate)}
                    className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download PDF
                  </button>
                  
                  <button
                    onClick={() => window.print()}
                    className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    <Printer className="w-5 h-5 mr-2" />
                    Print
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
