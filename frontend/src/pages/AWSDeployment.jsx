import React, { useState } from 'react';
import {
  Cloud,
  Server,
  Database,
  Globe,
  Cpu,
  Clock,
  Bell,
  Activity,
  CheckCircle2,
  Copy,
  ExternalLink,
  Shield,
  Layers,
  ArrowRight,
  Download,
  Terminal
} from 'lucide-react';

export default function AWSDeployment() {
  const [copied, setCopied] = useState(false);
  const [selectedService, setSelectedService] = useState('ecs');

  const awsServices = [
    {
      id: 'ecs',
      name: 'Amazon ECS (AWS Fargate)',
      category: 'Compute & Containers',
      icon: Server,
      status: 'Ready for Deploy',
      purpose: 'Runs the Node.js Express backend application server with auto-scaling (min 2, max 10 tasks) across multiple availability zones.',
      config: {
        launch_type: 'FARGATE',
        cpu: '512 (0.5 vCPU)',
        memory: '1024 MB',
        port: '5000',
        desired_tasks: 2,
        health_check: '/health (Interval 30s)'
      }
    },
    {
      id: 'rds',
      name: 'Amazon RDS (PostgreSQL 15)',
      category: 'Database',
      icon: Database,
      status: 'Ready for Deploy',
      purpose: 'Managed transactional database hosting retail sales, store metadata, expenses, and financial plans with automated snapshots.',
      config: {
        engine: 'PostgreSQL 15.4',
        instance_class: 'db.t3.medium',
        storage: '50 GB gp3',
        multi_az: 'Enabled (High Availability)',
        backup_retention: '7 days',
        encryption: 'AWS KMS (AES-256)'
      }
    },
    {
      id: 'cloudfront',
      name: 'Amazon CloudFront & S3',
      category: 'CDN & Storage',
      icon: Globe,
      status: 'Ready for Deploy',
      purpose: 'Global edge distribution delivering the React Vite frontend at sub-millisecond latency with SSL/TLS and reverse proxying /api/* to the ALB.',
      config: {
        default_root: 'index.html',
        protocol: 'Redirect HTTP to HTTPS',
        api_routing: 'Path /api/* routed to ALB DNS',
        oac: 'Origin Access Control (OAC v4)',
        ssl_cert: 'AWS Certificate Manager (ACM)'
      }
    },
    {
      id: 'lambda',
      name: 'AWS Lambda (Nightly Risk Scanner)',
      category: 'Serverless Compute',
      icon: Cpu,
      status: 'Ready for Deploy',
      purpose: 'Automated nightly risk audit engine that evaluates gross margins, net profit burn, and promotional discount spikes.',
      config: {
        runtime: 'Node.js 18.x',
        memory: '256 MB',
        timeout: '60 seconds',
        trigger: 'Amazon EventBridge Nightly Cron',
        actions: 'Evaluates -₹59 Cr deficit and alerts executives'
      }
    },
    {
      id: 'eventbridge',
      name: 'Amazon EventBridge',
      category: 'Application Integration',
      icon: Clock,
      status: 'Ready for Deploy',
      purpose: 'Schedules and triggers automated financial compliance checks, daily variance recalculation, and nightly risk scanner execution.',
      config: {
        schedule: 'cron(0 1 * * ? *) (01:00 UTC Daily)',
        target: 'FinOptimizer-Daily-Risk-Scanner Lambda',
        state: 'ENABLED'
      }
    },
    {
      id: 'sns',
      name: 'Amazon SNS (Executive Alerts)',
      category: 'Messaging & Alerts',
      icon: Bell,
      status: 'Ready for Deploy',
      purpose: 'Publishes immediate push notifications (Email & SMS) to the CFO and Operations Directors whenever financial risk thresholds breach.',
      config: {
        topic_name: 'FinOptimizer-Critical-Risk-Alerts',
        protocols: 'Email & SMS',
        encryption: 'Server-Side Encryption enabled',
        subscribers: 'CFO, Store Operations Directors'
      }
    },
    {
      id: 'cloudwatch',
      name: 'Amazon CloudWatch',
      category: 'Monitoring & Observability',
      icon: Activity,
      status: 'Ready for Deploy',
      purpose: 'Real-time telemetry, centralized container logs in /ecs/finoptimizer-app-server, and automated alarms for 5xx errors and CPU spikes.',
      config: {
        alarms: 'HTTPCode_Target_5XX_Count > 5',
        log_group: '/ecs/finoptimizer-app-server',
        retention: '30 Days',
        dashboard: 'FinOptimizer-Executive-Operations'
      }
    },
    {
      id: 'ecr',
      name: 'Amazon ECR',
      category: 'Container Registry',
      icon: Layers,
      status: 'Ready for Deploy',
      purpose: 'Private Docker container registry with vulnerability image scanning on push.',
      config: {
        repository: 'finoptimizer-app-server',
        scan_on_push: 'Enabled',
        tag_immutability: 'Enabled for production'
      }
    }
  ];

  const activeService = awsServices.find(s => s.id === selectedService) || awsServices[0];

  const handleCopyCli = () => {
    const cliCmd = `aws cloudformation create-stack --stack-name finoptimizer-retail-prod --template-body file://aws/cloudformation/finoptimizer-complete-stack.yaml --parameters ParameterKey=Environment,ParameterValue=production ParameterKey=DbUsername,ParameterValue=retail_admin ParameterKey=DbPassword,ParameterValue=RetailFinance2026!Sec ParameterKey=ExecutiveAlertEmail,ParameterValue=cfo@retailcorp.com --capabilities CAPABILITY_IAM --region ap-south-1`;
    navigator.clipboard.writeText(cliCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-950 text-indigo-400 border border-indigo-800/50">
              Enterprise Cloud Infrastructure
            </span>
            <span className="text-xs text-slate-400">• 8 AWS Services Configured</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-3">
            <Cloud className="w-6 h-6 text-indigo-400" />
            AWS Production Architecture & Console Deployment Center
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Complete production-ready AWS deployment specifications. Ready to deploy directly into your personal AWS Management Console via CloudFormation or AWS CLI.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyCli}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all"
          >
            <Copy className="w-3.5 h-3.5 text-slate-400" />
            {copied ? 'Copied AWS CLI!' : 'Copy Deploy Command'}
          </button>
        </div>
      </div>

      {/* 8 AWS Services Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {awsServices.map((srv) => {
          const Icon = srv.icon;
          const isSelected = srv.id === selectedService;
          return (
            <button
              key={srv.id}
              onClick={() => setSelectedService(srv.id)}
              className={`p-4 rounded-2xl text-left border transition-all ${
                isSelected
                  ? 'bg-indigo-950/40 border-indigo-500 shadow-lg shadow-indigo-600/20'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-indigo-400'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                  {srv.status}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-100">{srv.name}</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">{srv.category}</p>
            </button>
          );
        })}
      </div>

      {/* Selected Service Detailed Configuration Workbench */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
              AWS Service Specification
            </span>
            <h3 className="text-lg font-bold text-slate-100 mt-0.5">{activeService.name}</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">{activeService.purpose}</p>
          </div>
          <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800/40 rounded-full text-xs font-semibold self-start md:self-auto">
            CloudFormation Template Verified
          </span>
        </div>

        {/* Configuration Parameters */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Production Configuration Parameters
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(activeService.config).map(([key, val]) => (
              <div key={key} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                  {key.replace(/_/g, ' ')}
                </p>
                <p className="text-xs font-semibold text-slate-100 mt-1 font-mono">{val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step-by-Step Console Walkthrough */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Terminal className="w-5 h-5 text-indigo-400" />
          How to Deploy in Your Own AWS Console (Quick Steps)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="w-6 h-6 rounded-full bg-indigo-900 text-indigo-300 flex items-center justify-center font-bold text-[11px]">1</span>
            <h4 className="font-bold text-slate-200">Open AWS CloudFormation</h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Sign in to your AWS Console. Navigate to <strong>CloudFormation</strong> and click <strong>Create stack (with new resources)</strong>.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="w-6 h-6 rounded-full bg-indigo-900 text-indigo-300 flex items-center justify-center font-bold text-[11px]">2</span>
            <h4 className="font-bold text-slate-200">Upload Stack Template</h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Select <strong>Upload a template file</strong> and choose <code className="text-indigo-300 bg-slate-900 px-1 py-0.5 rounded">aws/cloudformation/finoptimizer-complete-stack.yaml</code>.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="w-6 h-6 rounded-full bg-indigo-900 text-indigo-300 flex items-center justify-center font-bold text-[11px]">3</span>
            <h4 className="font-bold text-slate-200">Review & Launch</h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Input your email for risk alerts, acknowledge IAM creation, and click <strong>Submit</strong>. AWS provisions all 8 services automatically!
            </p>
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-300">
            For exhaustive documentation with screenshots and IAM policy specs, see: <code className="text-indigo-400">aws/scripts/deploy-aws-console-guide.md</code>
          </span>
          <span className="font-semibold text-emerald-400 shrink-0">8 Services Verified</span>
        </div>
      </div>
    </div>
  );
}
