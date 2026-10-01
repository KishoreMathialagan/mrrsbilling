import { query as dbQuery } from '@/lib/db';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import Link from 'next/link';
import { ArrowLeft, MapPin, Phone, Mail, CheckCircle, ShieldCheck, Award } from 'lucide-react';
import PrintButton from './PrintButton';

export default async function ReceiptViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const receiptRes = await dbQuery(`
    SELECT r.*, row_to_json(c.*) as customer
    FROM "Receipt" r
    LEFT JOIN "Customer" c ON r."customerId" = c.id
    WHERE r.id = $1
  `, [id]);

  if (receiptRes.rowCount === 0) {
    notFound();
  }

  const receipt = receiptRes.rows[0];

  const transactionsRes = await dbQuery(`
    SELECT * FROM "Transaction" WHERE "receiptId" = $1 ORDER BY date ASC
  `, [id]);
  const transactions = transactionsRes.rows;

  const totalWeight = transactions.reduce((acc: number, t: any) => acc + (t.weight || 0), 0);
  const totalMakerCharge = transactions.reduce((acc: number, t: any) => acc + (t.G || 0), 0);
  const totalFinalPrice = transactions.reduce((acc: number, t: any) => acc + (t.finalPrice || 0), 0);
  const grandTotal = receipt.totalAmount || totalFinalPrice;

  return (
    <div className="max-w-[1000px] mx-auto space-y-6 pb-20 print:max-w-none print:w-full print:m-0 print:p-0 print:space-y-0">
      <div className="flex items-center justify-between mb-6 print:hidden px-4">
        <div className="flex items-center space-x-4">
          <Link href="/receipts" className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-600">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Receipt Details</h1>
        </div>
        <PrintButton />
      </div>

      {/* Printable Receipt Area */}
      <div id="printable-receipt" className="bg-white min-h-[1100px] relative overflow-hidden text-[#333] shadow-lg border border-gray-100 print:shadow-none print:border-none print:p-0">
        
        {/* Background Floral Graphic (Bottom Right) */}
        <div className="absolute -bottom-16 -right-16 opacity-20 pointer-events-none">
          <svg width="300" height="300" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 100C100 100 150 50 180 80C210 110 100 100 100 100Z" stroke="#B38F5F" strokeWidth="2"/>
            <path d="M100 100C100 100 50 50 20 80C-10 110 100 100 100 100Z" stroke="#B38F5F" strokeWidth="2"/>
            <path d="M100 100C100 100 150 150 180 120C210 90 100 100 100 100Z" stroke="#B38F5F" strokeWidth="2"/>
            <path d="M100 100C100 100 50 150 20 120C-10 90 100 100 100 100Z" stroke="#B38F5F" strokeWidth="2"/>
            <path d="M100 100C100 100 100 20 130 10C160 0 100 100 100 100Z" stroke="#B38F5F" strokeWidth="2"/>
            <path d="M100 100C100 100 100 180 130 190C160 200 100 100 100 100Z" stroke="#B38F5F" strokeWidth="2"/>
            <path d="M100 100C100 100 100 20 70 10C40 0 100 100 100 100Z" stroke="#B38F5F" strokeWidth="2"/>
            <path d="M100 100C100 100 100 180 70 190C40 200 100 100 100 100Z" stroke="#B38F5F" strokeWidth="2"/>
            <circle cx="100" cy="100" r="10" stroke="#B38F5F" strokeWidth="2"/>
          </svg>
        </div>

        <div className="p-6 sm:p-12 relative z-10 flex flex-col min-h-full">
          
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start mb-8 sm:mb-12 gap-6 sm:gap-0 text-center sm:text-left">
            
            {/* Logo Area */}
            <div className="flex flex-col items-center">
              <img src="/assets/logo.png" alt="MRS Jewellery" className="h-20 sm:h-32 w-auto object-contain mb-2" />
              <span className="text-[9px] sm:text-[10px] font-medium text-[#B38F5F] tracking-widest mt-2">
                TRUST &middot; PURITY &middot; TIMELESS BEAUTY
              </span>
            </div>

            {/* Right Tagline */}
            <div className="text-center sm:text-right mt-0 sm:mt-6">
              <p className="italic font-serif text-[#666] text-base sm:text-lg">More than Jewellery,</p>
              <p className="italic font-serif text-[#666] text-base sm:text-lg border-b border-[#B38F5F] pb-1 inline-block sm:block">It&apos;s a Part of Your Story</p>
            </div>
          </div>

          {/* Contact & Receipt Info */}
          <div className="flex flex-col sm:flex-row justify-between mb-10 gap-6 sm:gap-0">
            {/* Address */}
            <div className="space-y-4 w-full sm:max-w-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#B38F5F] shrink-0 mt-0.5" />
                <div className="text-[12px] sm:text-[13px] leading-relaxed text-[#444]">
                  <strong>MRS Jewellery</strong><br/>
                  123, Grand Plaza, Shop No. 4,<br/>
                  Rasipuram Road, Namakkal - 637401<br/>
                  Tamil Nadu, India
                </div>
              </div>
              <div className="flex items-center gap-3 text-[12px] sm:text-[13px] text-[#444]">
                <Phone className="w-5 h-5 text-[#B38F5F] shrink-0" />
                +91 98765 43210
              </div>
              <div className="flex items-center gap-3 text-[12px] sm:text-[13px] text-[#444]">
                <Mail className="w-5 h-5 text-[#B38F5F] shrink-0" />
                care@mrs.in
              </div>
            </div>

            {/* Receipt Details */}
            <div className="w-full sm:w-80">
              <h2 className="text-xl sm:text-2xl font-bold tracking-widest text-[#333] mb-4">RECEIPT</h2>
              
              <div className="bg-[#EBEBEB] px-4 py-2 flex justify-between items-center mb-4 text-[12px] sm:text-[13px]">
                <span className="font-semibold text-[#555]">Receipt ID</span>
                <span className="font-bold text-[#111]">{receipt.receiptNumber}</span>
              </div>
              
              <div className="space-y-2 text-[12px] sm:text-[13px] pl-0 sm:pl-4">
                <div className="grid grid-cols-[100px_10px_1fr]">
                  <span className="text-[#555]">Date</span>
                  <span>:</span>
                  <span className="font-medium">{format(new Date(receipt.date), 'dd MMM yyyy')}</span>
                </div>
                <div className="grid grid-cols-[100px_10px_1fr]">
                  <span className="text-[#555]">Customer</span>
                  <span>:</span>
                  <span className="font-medium">{receipt.customer?.name || 'Walk-in Customer'}</span>
                </div>
                <div className="grid grid-cols-[100px_10px_1fr]">
                  <span className="text-[#555]">Payment Method</span>
                  <span>:</span>
                  <span className="font-medium">Cash</span>
                </div>
                <div className="grid grid-cols-[100px_10px_1fr]">
                  <span className="text-[#555]">Sales Person</span>
                  <span>:</span>
                  <span className="font-medium">Admin</span>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="mb-10 w-full overflow-hidden border border-[#D9D9D9] overflow-x-auto">
            <table className="w-full text-center text-[10px] sm:text-[11px] whitespace-nowrap">
              <thead className="bg-[#F6F3ED] text-[#4A3C31]">
                <tr>
                  <th className="py-3 px-1 border-r border-[#D9D9D9] font-bold">S. No.</th>
                  <th className="py-3 px-2 border-r border-[#D9D9D9] font-bold">DATE</th>
                  <th className="py-3 px-2 border-r border-[#D9D9D9] font-bold">CUSTOMER</th>
                  <th className="py-3 px-2 border-r border-[#D9D9D9] font-bold">ITEM</th>
                  <th className="py-3 px-1 border-r border-[#D9D9D9] font-bold">WEIGHT<br/>(KG)</th>
                  <th className="py-3 px-1 border-r border-[#D9D9D9] font-bold">TOUCH<br/>(%)</th>
                  <th className="py-3 px-1 border-r border-[#D9D9D9] font-bold">WASTAGE<br/>(%)</th>
                  <th className="py-3 px-1 border-r border-[#D9D9D9] font-bold">PURE</th>
                  <th className="py-3 px-1 border-r border-[#D9D9D9] font-bold">MAKER<br/>CHARGE PER KG</th>
                  <th className="py-3 px-1 border-r border-[#D9D9D9] font-bold">MAKER<br/>CHARGE</th>
                  <th className="py-3 px-2 border-r border-[#D9D9D9] font-bold">FINAL<br/>PRICE</th>
                  <th className="py-3 px-2 font-bold">REMARK</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t: any, idx: number) => (
                  <tr key={idx} className="border-t border-[#D9D9D9]">
                    <td className="py-4 px-1 border-r border-[#D9D9D9] text-[#444]">{idx + 1}</td>
                    <td className="py-4 px-2 border-r border-[#D9D9D9] text-[#444]">{format(new Date(t.date), 'dd/MM/yyyy')}</td>
                    <td className="py-4 px-2 border-r border-[#D9D9D9] text-[#444]">{receipt.customer?.name || 'Walk-in'}</td>
                    <td className="py-4 px-2 border-r border-[#D9D9D9] text-[#444] font-medium">{t.itemName}</td>
                    <td className="py-4 px-1 border-r border-[#D9D9D9] text-[#444]">{t.weight?.toFixed(3) || '-'}</td>
                    <td className="py-4 px-1 border-r border-[#D9D9D9] text-[#444]">{t.touch?.toFixed(2) || '-'}</td>
                    <td className="py-4 px-1 border-r border-[#D9D9D9] text-[#444]">{t.wastage?.toFixed(2) || '-'}</td>
                    <td className="py-4 px-1 border-r border-[#D9D9D9] text-[#444]">{t.pure?.toFixed(3) || '-'}</td>
                    <td className="py-4 px-1 border-r border-[#D9D9D9] text-[#444]">{t.makerCharge ? `₹${t.makerCharge.toFixed(2)}` : '-'}</td>
                    <td className="py-4 px-1 border-r border-[#D9D9D9] text-[#444]">{t.G ? `₹${t.G.toFixed(2)}` : '-'}</td>
                    <td className="py-4 px-2 border-r border-[#D9D9D9] text-[#111] font-bold">{t.finalPrice ? `₹${t.finalPrice.toFixed(2)}` : '-'}</td>
                    <td className="py-4 px-2 text-[#444] text-xs max-w-[100px] truncate">{t.remark || '-'}</td>
                  </tr>
                ))}
                
                {/* Empty Filler Rows if transactions are less than 3 */}
                {Array.from({ length: Math.max(0, 3 - transactions.length) }).map((_, idx) => (
                  <tr key={`empty-${idx}`} className="border-t border-[#D9D9D9] h-16">
                    <td className="border-r border-[#D9D9D9]"></td>
                    <td className="border-r border-[#D9D9D9]"></td>
                    <td className="border-r border-[#D9D9D9]"></td>
                    <td className="border-r border-[#D9D9D9]"></td>
                    <td className="border-r border-[#D9D9D9]"></td>
                    <td className="border-r border-[#D9D9D9]"></td>
                    <td className="border-r border-[#D9D9D9]"></td>
                    <td className="border-r border-[#D9D9D9]"></td>
                    <td className="border-r border-[#D9D9D9]"></td>
                    <td className="border-r border-[#D9D9D9]"></td>
                    <td className="border-r border-[#D9D9D9]"></td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary & Terms */}
          <div className="flex flex-col sm:flex-row justify-between items-start flex-1 mb-12 gap-8 sm:gap-0">
            {/* Terms & Conditions */}
            <div className="max-w-sm">
              <h4 className="font-bold text-[13px] tracking-widest text-[#333] mb-4">TERMS & CONDITIONS</h4>
              <ul className="space-y-2 text-[12px] text-[#555] list-none">
                <li className="flex items-start">
                  <span className="text-[#B38F5F] mr-2 mt-1 shrink-0 text-[10px]">●</span>
                  <span>All weights are in kilograms (Kg).</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#B38F5F] mr-2 mt-1 shrink-0 text-[10px]">●</span>
                  <span>The purity and wastage are as per the industry standards.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#B38F5F] mr-2 mt-1 shrink-0 text-[10px]">●</span>
                  <span>This is a computer generated receipt and does not require a signature.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#B38F5F] mr-2 mt-1 shrink-0 text-[10px]">●</span>
                  <span>Thank you for choosing MRS.</span>
                </li>
              </ul>
            </div>

            {/* Totals */}
            <div className="w-full sm:w-[350px]">
              <div className="flex justify-between items-center py-2 text-[13px] text-[#555] font-semibold tracking-wide border-t border-[#D9D9D9]">
                <span>TOTAL WEIGHT (KG)</span>
                <span>{totalWeight.toFixed(3)}</span>
              </div>
              <div className="flex justify-between items-center py-2 text-[13px] text-[#555] font-semibold tracking-wide border-t border-[#D9D9D9]">
                <span>TOTAL MAKER CHARGE</span>
                <span>₹ {totalMakerCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-2 text-[13px] text-[#555] font-semibold tracking-wide border-t border-[#D9D9D9]">
                <span>TOTAL FINAL PRICE</span>
                <span>₹ {totalFinalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-3 text-[14px] sm:text-[16px] text-[#111] font-bold tracking-widest border-t border-b border-[#B38F5F]">
                <span>GRAND TOTAL</span>
                <span>₹ {grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer section */}
          <div className="mt-auto">
            <div className="text-center mb-10">
              <h2 className="text-4xl sm:text-5xl text-[#B38F5F] mb-3" style={{ fontFamily: 'cursive, "Brush Script MT", "Dancing Script"' }}>Thank You!</h2>
              <p className="text-[11px] sm:text-[13px] tracking-[0.2em] font-bold text-[#555]">FOR YOUR VALUABLE TRUST</p>
              <div className="flex items-center justify-center gap-4 mt-6">
                <div className="h-[1px] bg-gray-300 w-12 sm:w-16"></div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B38F5F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 3h12l4 6-10 12L2 9l4-6z" />
                  <path d="M2 9h20" />
                  <path d="M12 21V9" />
                  <path d="M6 3l6 6" />
                  <path d="M18 3l-6 6" />
                </svg>
                <div className="h-[1px] bg-gray-300 w-12 sm:w-16"></div>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-16 pb-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-[#B38F5F]" strokeWidth={1.5} />
                <div className="text-[9px] sm:text-[11px] text-[#555] font-medium leading-tight">
                  100% Hallmark<br/>Jewellery
                </div>
              </div>
              
              <div className="hidden sm:block h-8 w-[1px] bg-gray-300"></div>

              <div className="flex items-center gap-2 sm:gap-3">
                <svg width="24" height="24" className="sm:w-[32px] sm:h-[32px]" viewBox="0 0 24 24" fill="none" stroke="#B38F5F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 3h12l4 6-10 12L2 9l4-6z" />
                </svg>
                <div className="text-[9px] sm:text-[11px] text-[#555] font-medium leading-tight">
                  Certified<br/>Purity
                </div>
              </div>
              
              <div className="hidden sm:block h-8 w-[1px] bg-gray-300"></div>

              <div className="flex items-center gap-2 sm:gap-3">
                <Award className="w-6 h-6 sm:w-8 sm:h-8 text-[#B38F5F]" strokeWidth={1.5} />
                <div className="text-[9px] sm:text-[11px] text-[#555] font-medium leading-tight">
                  Trusted<br/>Since 1990
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
