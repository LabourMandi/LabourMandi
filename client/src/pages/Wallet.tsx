import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";
import {
  Wallet,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  Building2,
  Smartphone,
  Download,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  Sun,
  Moon,
  Bell,
  IndianRupee,
} from "lucide-react";
import { Link } from "wouter";
import type { Transaction } from "@shared/schema";

const mockTransactions: Transaction[] = [
  {
    id: "t1",
    userId: "u1",
    type: "earning",
    amount: "15000",
    description: "Payment for Mason Work - Commercial Building Project",
    referenceId: "JOB-001",
    referenceType: "job",
    status: "completed",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: "t2",
    userId: "u1",
    type: "deposit",
    amount: "5000",
    description: "Deposit via UPI",
    referenceId: "DEP-001",
    referenceType: "deposit",
    status: "completed",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "t3",
    userId: "u1",
    type: "payment",
    amount: "8500",
    description: "JCB Rental Payment - 2 days",
    referenceId: "RENT-001",
    referenceType: "rental",
    status: "completed",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: "t4",
    userId: "u1",
    type: "earning",
    amount: "25000",
    description: "Payment for Electrical Work - Office Building",
    referenceId: "JOB-002",
    referenceType: "job",
    status: "completed",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "t5",
    userId: "u1",
    type: "withdrawal",
    amount: "10000",
    description: "Withdrawal to Bank Account",
    referenceId: "WD-001",
    referenceType: "withdrawal",
    status: "pending",
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
  },
  {
    id: "t6",
    userId: "u1",
    type: "debit",
    amount: "500",
    description: "Platform Service Fee",
    referenceId: "FEE-001",
    referenceType: "fee",
    status: "completed",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
];

function TransactionRow({ transaction }: { transaction: Transaction }) {
  const isCredit = ["earning", "deposit", "credit"].includes(transaction.type);
  const statusColors = {
    completed: "bg-green-500/10 text-green-600",
    pending: "bg-orange-500/10 text-orange-600",
    failed: "bg-red-500/10 text-red-600",
  };

  const typeIcons = {
    earning: TrendingUp,
    deposit: ArrowDownLeft,
    payment: ArrowUpRight,
    withdrawal: ArrowUpRight,
    debit: ArrowUpRight,
    credit: ArrowDownLeft,
  };

  const Icon = typeIcons[transaction.type as keyof typeof typeIcons] || ArrowDownLeft;

  return (
    <div className="flex items-center justify-between py-4 border-b border-border last:border-0" data-testid={`transaction-${transaction.id}`}>
      <div className="flex items-center gap-4">
        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${isCredit ? "bg-green-500/10" : "bg-red-500/10"}`}>
          <Icon className={`h-5 w-5 ${isCredit ? "text-green-600" : "text-red-600"}`} />
        </div>
        <div>
          <p className="font-medium">{transaction.description}</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{new Date(transaction.createdAt!).toLocaleDateString()}</span>
            <span>•</span>
            <span className="capitalize">{transaction.type}</span>
            {transaction.referenceId && (
              <>
                <span>•</span>
                <span>{transaction.referenceId}</span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-semibold text-lg ${isCredit ? "text-green-600" : "text-red-600"}`}>
          {isCredit ? "+" : "-"}₹{Number(transaction.amount).toLocaleString("en-IN")}
        </p>
        <Badge variant="outline" className={statusColors[transaction.status as keyof typeof statusColors]}>
          {transaction.status === "completed" && <CheckCircle className="h-3 w-3 mr-1" />}
          {transaction.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
          {transaction.status === "failed" && <XCircle className="h-3 w-3 mr-1" />}
          {transaction.status}
        </Badge>
      </div>
    </div>
  );
}

export default function WalletPage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("upi");

  const walletBalance = Number(user?.walletBalance || 26000);
  const totalEarnings = 40000;
  const pendingAmount = 10000;

  const handleDeposit = () => {
    toast({ title: `Deposit of ₹${depositAmount} initiated!` });
    setDepositDialogOpen(false);
    setDepositAmount("");
  };

  const handleWithdraw = () => {
    toast({ title: `Withdrawal of ₹${withdrawAmount} initiated!` });
    setWithdrawDialogOpen(false);
    setWithdrawAmount("");
  };

  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  } as React.CSSProperties;

  return (
    <SidebarProvider style={sidebarStyle}>
      <div className="flex h-screen w-full">
        <DashboardSidebar />
        <SidebarInset className="flex-1 flex flex-col">
          <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <Breadcrumbs items={[{ label: "Wallet" }]} />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Link href="/notifications">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6 custom-scrollbar">
            <div className="mb-8">
              <h1 className="text-2xl font-bold font-[Poppins] mb-2">Wallet</h1>
              <p className="text-muted-foreground">Manage your funds, earnings, and payments</p>
            </div>

            {/* Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-primary text-primary-foreground">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Wallet className="h-8 w-8 opacity-80" />
                    <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground">
                      Available
                    </Badge>
                  </div>
                  <p className="text-sm opacity-80 mb-1">Wallet Balance</p>
                  <p className="text-3xl font-bold" data-testid="text-wallet-balance">
                    ₹{walletBalance.toLocaleString("en-IN")}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <TrendingUp className="h-8 w-8 text-green-500" />
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      This Month
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">Total Earnings</p>
                  <p className="text-3xl font-bold">₹{totalEarnings.toLocaleString("en-IN")}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Clock className="h-8 w-8 text-orange-500" />
                    <Badge variant="outline" className="text-orange-600 border-orange-200">
                      In Progress
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">Pending Amount</p>
                  <p className="text-3xl font-bold">₹{pendingAmount.toLocaleString("en-IN")}</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-4 mb-8">
              <Dialog open={depositDialogOpen} onOpenChange={setDepositDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2" data-testid="button-deposit">
                    <Plus className="h-4 w-4" />
                    Add Money
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Money to Wallet</DialogTitle>
                    <DialogDescription>
                      Choose your preferred payment method and enter the amount
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Amount (₹)</label>
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        data-testid="input-deposit-amount"
                      />
                    </div>
                    <div className="flex gap-2">
                      {[500, 1000, 2000, 5000].map((amt) => (
                        <Button
                          key={amt}
                          variant="outline"
                          size="sm"
                          onClick={() => setDepositAmount(amt.toString())}
                        >
                          ₹{amt}
                        </Button>
                      ))}
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Payment Method</label>
                      <div className="grid grid-cols-3 gap-3">
                        <Button
                          variant={paymentMethod === "upi" ? "default" : "outline"}
                          className="flex flex-col h-auto py-4"
                          onClick={() => setPaymentMethod("upi")}
                        >
                          <Smartphone className="h-6 w-6 mb-1" />
                          <span className="text-xs">UPI</span>
                        </Button>
                        <Button
                          variant={paymentMethod === "card" ? "default" : "outline"}
                          className="flex flex-col h-auto py-4"
                          onClick={() => setPaymentMethod("card")}
                        >
                          <CreditCard className="h-6 w-6 mb-1" />
                          <span className="text-xs">Card</span>
                        </Button>
                        <Button
                          variant={paymentMethod === "netbanking" ? "default" : "outline"}
                          className="flex flex-col h-auto py-4"
                          onClick={() => setPaymentMethod("netbanking")}
                        >
                          <Building2 className="h-6 w-6 mb-1" />
                          <span className="text-xs">Net Banking</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDepositDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleDeposit} disabled={!depositAmount} data-testid="button-confirm-deposit">
                      Add ₹{depositAmount || "0"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2" data-testid="button-withdraw">
                    <ArrowUpRight className="h-4 w-4" />
                    Withdraw
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Withdraw to Bank Account</DialogTitle>
                    <DialogDescription>
                      Enter the amount you want to withdraw to your linked bank account
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Available Balance</p>
                      <p className="text-2xl font-bold">₹{walletBalance.toLocaleString("en-IN")}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Withdraw Amount (₹)</label>
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        max={walletBalance}
                        data-testid="input-withdraw-amount"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Withdraw To</label>
                      <Select defaultValue="bank1">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bank1">HDFC Bank ****1234</SelectItem>
                          <SelectItem value="bank2">Add New Bank Account</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Withdrawals typically take 1-2 business days to process
                    </p>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setWithdrawDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleWithdraw}
                      disabled={!withdrawAmount || Number(withdrawAmount) > walletBalance}
                      data-testid="button-confirm-withdraw"
                    >
                      Withdraw ₹{withdrawAmount || "0"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Transaction History */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <div>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>Your recent wallet activity</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all">
                  <TabsList className="mb-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="earnings">Earnings</TabsTrigger>
                    <TabsTrigger value="payments">Payments</TabsTrigger>
                    <TabsTrigger value="deposits">Deposits</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all" className="m-0">
                    {mockTransactions.map((transaction) => (
                      <TransactionRow key={transaction.id} transaction={transaction} />
                    ))}
                  </TabsContent>
                  <TabsContent value="earnings" className="m-0">
                    {mockTransactions
                      .filter((t) => t.type === "earning")
                      .map((transaction) => (
                        <TransactionRow key={transaction.id} transaction={transaction} />
                      ))}
                  </TabsContent>
                  <TabsContent value="payments" className="m-0">
                    {mockTransactions
                      .filter((t) => ["payment", "debit"].includes(t.type))
                      .map((transaction) => (
                        <TransactionRow key={transaction.id} transaction={transaction} />
                      ))}
                  </TabsContent>
                  <TabsContent value="deposits" className="m-0">
                    {mockTransactions
                      .filter((t) => t.type === "deposit")
                      .map((transaction) => (
                        <TransactionRow key={transaction.id} transaction={transaction} />
                      ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
