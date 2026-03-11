import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  getPaymentOrders,
  getPaymentOrderById,
  getRevenueSummary,
  syncPaymentStatus,
} from '../services/paymentService'
import type {
  PaymentOrder,
  PaymentOrderParams,
  RevenueSummaryResponse,
} from '../services/paymentService'

const PaymentManagement: React.FC = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState<PaymentOrder[]>([])
  const [revenueSummary, setRevenueSummary] = useState<RevenueSummaryResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<PaymentOrder | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  
  // Pagination & Filter states
  const [page, setPage] = useState(1)
  const [pageSize] = useState(20)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  
  // Filter states
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [filterOrderType, setFilterOrderType] = useState<string>('')
  const [filterFromDate, setFilterFromDate] = useState<string>('')
  const [filterToDate, setFilterToDate] = useState<string>('')
  const [searchKeyword, setSearchKeyword] = useState<string>('')

  // Fetch revenue summary
  const fetchRevenueSummary = async () => {
    try {
      const data = await getRevenueSummary()
      setRevenueSummary(data)
    } catch (error) {
      console.error('Error fetching revenue summary:', error)
    }
  }

  // Fetch payment orders
  const fetchPaymentOrders = async () => {
    try {
      setLoading(true)
      const params: PaymentOrderParams = {
        page,
        pageSize,
      }
      
      if (filterStatus) params.status = filterStatus as any
      if (filterOrderType) params.orderType = filterOrderType as any
      if (filterFromDate) params.fromDate = filterFromDate
      if (filterToDate) params.toDate = filterToDate
      if (searchKeyword) params.searchKeyword = searchKeyword

      const data = await getPaymentOrders(params)
      setOrders(data.items)
      setTotalPages(data.totalPages)
      setTotalCount(data.totalCount)
    } catch (error) {
      console.error('Error fetching payment orders:', error)
    } finally {
      setLoading(false)
    }
  }

  // Handle sync payment status
  const handleSync = async () => {
    try {
      setSyncing(true)
      await syncPaymentStatus()
      alert('Đồng bộ trạng thái thanh toán thành công!')
      await fetchPaymentOrders()
      await fetchRevenueSummary()
    } catch (error) {
      console.error('Error syncing payment status:', error)
      alert('Đồng bộ thất bại. Vui lòng thử lại!')
    } finally {
      setSyncing(false)
    }
  }

  // View order detail
  const viewOrderDetail = async (orderId: number) => {
    try {
      const orderDetail = await getPaymentOrderById(orderId)
      setSelectedOrder(orderDetail)
      setShowDetailModal(true)
    } catch (error) {
      console.error('Error fetching order detail:', error)
      alert('Không thể lấy thông tin chi tiết đơn hàng')
    }
  }

  // Apply filters
  const handleApplyFilters = () => {
    setPage(1) // Reset to first page
    fetchPaymentOrders()
  }

  // Reset filters
  const handleResetFilters = () => {
    setFilterStatus('')
    setFilterOrderType('')
    setFilterFromDate('')
    setFilterToDate('')
    setSearchKeyword('')
    setPage(1)
  }

  // Initial load
  useEffect(() => {
    fetchRevenueSummary()
    fetchPaymentOrders()
  }, [page])

  useEffect(() => {
    if (filterStatus === '' && filterOrderType === '' && filterFromDate === '' && filterToDate === '' && searchKeyword === '') {
      fetchPaymentOrders()
    }
  }, [filterStatus, filterOrderType, filterFromDate, filterToDate, searchKeyword])

  // Check if user is admin
  const isAdmin = user?.role?.toLowerCase() === 'admin'
  
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Access Denied. Admin only.</p>
          <Link
            to="/"
            className="inline-block rounded-md bg-[#1976d2] px-6 py-2 text-sm font-semibold text-white shadow hover:bg-[#145ca5] transition-colors"
          >
            Go to Home
          </Link>
        </div>
      </div>
    )
  }

  // Helper functions
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'cancelled':
        return 'bg-red-100 text-red-700'
      case 'expired':
        return 'bg-gray-100 text-gray-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getOrderTypeLabel = (orderType: string) => {
    switch (orderType) {
      case 'course_purchase':
        return 'Mua khóa học'
      case 'subscription':
        return 'Đăng ký gói'
      default:
        return orderType
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString('vi-VN')
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/admin-dashboard" className="text-[#1976d2] hover:text-[#145ca5] text-sm mb-2 inline-flex items-center gap-1">
                <i className="fa-solid fa-arrow-left"></i> Quay lại Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-slate-900">Quản lý thanh toán</h1>
            </div>
            <button
              onClick={handleSync}
              disabled={syncing}
              className="px-4 py-2 bg-[#1976d2] text-white rounded-lg hover:bg-[#145ca5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <i className={`fa-solid fa-sync ${syncing ? 'fa-spin' : ''}`}></i>
              {syncing ? 'Đang đồng bộ...' : 'Đồng bộ PayOS'}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Revenue Stats */}
        {revenueSummary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Tổng doanh thu</p>
                  <p className="text-2xl font-bold text-slate-900 mt-2">
                    {formatCurrency(revenueSummary.totalRevenue)}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <i className="fa-solid fa-dollar-sign text-2xl text-green-600"></i>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Doanh thu tháng này</p>
                  <p className="text-2xl font-bold text-slate-900 mt-2">
                    {formatCurrency(revenueSummary.revenueThisMonth)}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    +{revenueSummary.monthOverMonthGrowthPercent.toFixed(1)}% so với tháng trước
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <i className="fa-solid fa-chart-line text-2xl text-[#1976d2]"></i>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Tổng giao dịch</p>
                  <p className="text-2xl font-bold text-slate-900 mt-2">
                    {revenueSummary.totalTransactions}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    Thành công: {revenueSummary.paidTransactions}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <i className="fa-solid fa-receipt text-2xl text-purple-600"></i>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Đang chờ</p>
                  <p className="text-2xl font-bold text-slate-900 mt-2">
                    {revenueSummary.pendingTransactions}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">Giao dịch pending</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <i className="fa-solid fa-clock text-2xl text-yellow-600"></i>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Revenue by Month Chart */}
        {revenueSummary && revenueSummary.revenueByMonth.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200 mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <i className="fa-solid fa-chart-bar text-[#1976d2]"></i>
              Doanh thu theo tháng
            </h2>
            <div className="space-y-4">
              {revenueSummary.revenueByMonth.map((data, index) => {
                const maxRevenue = Math.max(...revenueSummary.revenueByMonth.map(d => d.totalRevenue))
                return (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-24 text-sm font-medium text-slate-600">
                      Tháng {data.month}/{data.year}
                    </div>
                    <div className="flex-1 bg-slate-100 rounded-full h-8 relative overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#1976d2] to-[#64b5f6] rounded-full flex items-center justify-end pr-3 transition-all duration-500"
                        style={{ width: `${(data.totalRevenue / maxRevenue) * 100}%` }}
                      >
                        <span className="text-xs font-bold text-white">
                          {formatCurrency(data.totalRevenue)}
                        </span>
                      </div>
                    </div>
                    <div className="w-20 text-sm text-slate-600 text-right">
                      {data.transactionCount} giao dịch
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200 mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Bộ lọc</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Trạng thái</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1976d2] focus:border-transparent"
              >
                <option value="">Tất cả</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="cancelled">Cancelled</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Loại đơn</label>
              <select
                value={filterOrderType}
                onChange={(e) => setFilterOrderType(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1976d2] focus:border-transparent"
              >
                <option value="">Tất cả</option>
                <option value="course_purchase">Mua khóa học</option>
                <option value="subscription">Đăng ký gói</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Từ ngày</label>
              <input
                type="date"
                value={filterFromDate}
                onChange={(e) => setFilterFromDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1976d2] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Đến ngày</label>
              <input
                type="date"
                value={filterToDate}
                onChange={(e) => setFilterToDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1976d2] focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Tìm kiếm</label>
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Email, tên, mã đơn hàng..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1976d2] focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={handleApplyFilters}
              className="px-4 py-2 bg-[#1976d2] text-white rounded-lg hover:bg-[#145ca5] transition-colors"
            >
              Áp dụng
            </button>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
            >
              Đặt lại
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">
              Danh sách giao dịch ({totalCount})
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <i className="fa-solid fa-spinner fa-spin text-3xl text-[#1976d2]"></i>
              <p className="text-slate-600 mt-3">Đang tải dữ liệu...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-slate-600">Không có giao dịch nào</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Mã đơn
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Khách hàng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Loại
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Số tiền
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Ngày tạo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-slate-900">{order.orderCode}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-slate-900">{order.userFullName}</div>
                          <div className="text-sm text-slate-500">{order.userEmail}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-900">{getOrderTypeLabel(order.orderType)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-slate-900">
                            {formatCurrency(order.amount)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}>
                            {order.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-900">{formatDate(order.createdAt)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => viewOrderDetail(order.id)}
                            className="text-[#1976d2] hover:text-[#145ca5] font-medium"
                          >
                            Chi tiết
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
                  <div className="text-sm text-slate-600">
                    Trang {page} / {totalPages} (Tổng: {totalCount} giao dịch)
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="px-3 py-1 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    <button
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="px-3 py-1 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <i className="fa-solid fa-chevron-right"></i>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Order Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Chi tiết giao dịch</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <i className="fa-solid fa-times text-slate-600"></i>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">Mã đơn hàng</p>
                  <p className="text-base font-semibold text-slate-900 mt-1">{selectedOrder.orderCode}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Trạng thái</p>
                  <span className={`mt-1 inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadgeClass(selectedOrder.status)}`}>
                    {selectedOrder.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500">Khách hàng</p>
                <p className="text-base text-slate-900 mt-1">{selectedOrder.userFullName}</p>
                <p className="text-sm text-slate-600">{selectedOrder.userEmail}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">Loại đơn hàng</p>
                  <p className="text-base text-slate-900 mt-1">{getOrderTypeLabel(selectedOrder.orderType)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Reference ID</p>
                  <p className="text-base text-slate-900 mt-1">{selectedOrder.referenceId}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500">Số tiền</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(selectedOrder.amount)}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500">PayOS Transaction ID</p>
                <p className="text-base text-slate-900 mt-1">{selectedOrder.payOSTransactionId || 'N/A'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">Ngày tạo</p>
                  <p className="text-base text-slate-900 mt-1">{formatDate(selectedOrder.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Ngày thanh toán</p>
                  <p className="text-base text-slate-900 mt-1">{formatDate(selectedOrder.paidAt || '')}</p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PaymentManagement
