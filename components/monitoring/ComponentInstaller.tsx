'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Download, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Settings, 
  Code, 
  FileText,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Component {
  id: string;
  name: string;
  description: string;
  category: 'monitoring' | 'alerting' | 'visualization' | 'management';
  status: 'available' | 'installed' | 'updating';
  version: string;
  dependencies: string[];
  configRequired: boolean;
  configGuide?: {
    title: string;
    steps: Array<{
      title: string;
      description: string;
      code?: string;
      note?: string;
    }>;
  };
}

const components: Component[] = [
  {
    id: 'snmp-collector',
    name: 'SNMP Data Collector',
    description: 'Advanced SNMP polling engine with bulk operations and error handling',
    category: 'monitoring',
    status: 'available',
    version: '2.1.0',
    dependencies: ['net-snmp', 'async-snmp'],
    configRequired: true,
    configGuide: {
      title: 'SNMP Collector Configuration',
      steps: [
        {
          title: 'Install SNMP Dependencies',
          description: 'Install required SNMP libraries on your system',
          code: 'sudo apt-get install snmp snmp-mibs-downloader\n# or on CentOS/RHEL\nsudo yum install net-snmp net-snmp-utils',
          note: 'Required for SNMP operations'
        },
        {
          title: 'Configure SNMP Community Strings',
          description: 'Set up community strings for device access',
          code: '{\n  "communities": {\n    "public": {\n      "version": "2c",\n      "community": "public"\n    },\n    "private": {\n      "version": "2c",\n      "community": "private"\n    }\n  }\n}',
          note: 'Store in secure configuration file'
        },
        {
          title: 'Define Polling Intervals',
          description: 'Configure how often to poll each device',
          code: '{\n  "polling": {\n    "default_interval": 300,\n    "fast_poll_oids": [\n      "1.3.6.1.2.1.1.3.0",\n      "1.3.6.1.2.1.2.2.1.10"\n    ],\n    "fast_interval": 60\n  }\n}'
        }
      ]
    }
  },
  {
    id: 'alert-engine',
    name: 'Alert Processing Engine',
    description: 'Intelligent alerting system with threshold management and escalation',
    category: 'alerting',
    status: 'installed',
    version: '1.8.2',
    dependencies: ['nodemailer', 'twilio'],
    configRequired: true,
    configGuide: {
      title: 'Alert Engine Setup',
      steps: [
        {
          title: 'Configure Notification Channels',
          description: 'Set up email, SMS, and webhook notifications',
          code: '{\n  "notifications": {\n    "email": {\n      "smtp_host": "smtp.gmail.com",\n      "smtp_port": 587,\n      "username": "alerts@company.com",\n      "password": "app_password"\n    },\n    "sms": {\n      "provider": "twilio",\n      "account_sid": "your_sid",\n      "auth_token": "your_token"\n    }\n  }\n}'
        },
        {
          title: 'Define Alert Thresholds',
          description: 'Configure when alerts should be triggered',
          code: '{\n  "thresholds": {\n    "cpu_usage": {\n      "warning": 80,\n      "critical": 95\n    },\n    "memory_usage": {\n      "warning": 85,\n      "critical": 95\n    },\n    "disk_usage": {\n      "warning": 90,\n      "critical": 98\n    }\n  }\n}'
        }
      ]
    }
  },
  {
    id: 'performance-analyzer',
    name: 'Performance Analytics',
    description: 'Real-time performance metrics analysis and trending',
    category: 'visualization',
    status: 'available',
    version: '3.0.1',
    dependencies: ['chart.js', 'moment'],
    configRequired: false
  },
  {
    id: 'device-discovery',
    name: 'Network Device Discovery',
    description: 'Automatic network scanning and device identification',
    category: 'management',
    status: 'updating',
    version: '1.5.0',
    dependencies: ['nmap', 'ping'],
    configRequired: true,
    configGuide: {
      title: 'Device Discovery Configuration',
      steps: [
        {
          title: 'Configure Network Ranges',
          description: 'Define which network segments to scan',
          code: '{\n  "discovery": {\n    "networks": [\n      "192.168.1.0/24",\n      "10.0.0.0/16",\n      "172.16.0.0/12"\n    ],\n    "exclude_ranges": [\n      "192.168.1.1-192.168.1.10"\n    ]\n  }\n}'
        },
        {
          title: 'Set Scan Parameters',
          description: 'Configure discovery timing and methods',
          code: '{\n  "scan_settings": {\n    "ping_timeout": 1000,\n    "port_scan": true,\n    "snmp_check": true,\n    "parallel_scans": 50\n  }\n}'
        }
      ]
    }
  }
];

export default function ComponentInstaller() {
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { toast } = useToast();

  const handleInstall = (component: Component) => {
    toast({
      title: "Installation Started",
      description: `Installing ${component.name}...`,
    });
    
    // Simulate installation process
    setTimeout(() => {
      toast({
        title: "Installation Complete",
        description: `${component.name} has been successfully installed.`,
      });
    }, 2000);
  };

  const handleUninstall = (component: Component) => {
    toast({
      title: "Uninstallation Started",
      description: `Removing ${component.name}...`,
    });
    
    setTimeout(() => {
      toast({
        title: "Uninstallation Complete",
        description: `${component.name} has been removed.`,
      });
    }, 1500);
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
      toast({
        title: "Copied to clipboard",
        description: "Configuration code has been copied.",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: Component['status']) => {
    switch (status) {
      case 'installed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'updating':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Download className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusBadge = (status: Component['status']) => {
    const variants = {
      installed: 'default',
      updating: 'secondary',
      available: 'outline'
    } as const;

    return (
      <Badge variant={variants[status]} className="ml-2">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const categorizedComponents = components.reduce((acc, component) => {
    if (!acc[component.category]) {
      acc[component.category] = [];
    }
    acc[component.category].push(component);
    return acc;
  }, {} as Record<string, Component[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Component Installer</h2>
          <p className="text-muted-foreground">
            Install and manage monitoring system components
          </p>
        </div>
      </div>

      <Tabs defaultValue="monitoring" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="alerting">Alerting</TabsTrigger>
          <TabsTrigger value="visualization">Visualization</TabsTrigger>
          <TabsTrigger value="management">Management</TabsTrigger>
        </TabsList>

        {Object.entries(categorizedComponents).map(([category, categoryComponents]) => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categoryComponents.map((component) => (
                <Card key={component.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{component.name}</CardTitle>
                      {getStatusIcon(component.status)}
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-muted-foreground">v{component.version}</span>
                      {getStatusBadge(component.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription>{component.description}</CardDescription>
                    
                    {component.dependencies.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Dependencies:</p>
                        <div className="flex flex-wrap gap-1">
                          {component.dependencies.map((dep) => (
                            <Badge key={dep} variant="secondary" className="text-xs">
                              {dep}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {component.status === 'available' && (
                        <Button 
                          onClick={() => handleInstall(component)}
                          className="flex-1"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Install
                        </Button>
                      )}
                      
                      {component.status === 'installed' && (
                        <Button 
                          variant="outline"
                          onClick={() => handleUninstall(component)}
                          className="flex-1"
                        >
                          Remove
                        </Button>
                      )}
                      
                      {component.status === 'updating' && (
                        <Button disabled className="flex-1">
                          Updating...
                        </Button>
                      )}

                      {component.configRequired && component.configGuide && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="icon">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh]">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <Settings className="h-5 w-5" />
                                {component.configGuide.title}
                              </DialogTitle>
                              <DialogDescription>
                                Follow these steps to configure {component.name}
                              </DialogDescription>
                            </DialogHeader>
                            
                            <ScrollArea className="max-h-[60vh] pr-4">
                              <div className="space-y-6">
                                {component.configGuide.steps.map((step, index) => (
                                  <div key={index} className="space-y-3">
                                    <div className="flex items-center gap-2">
                                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                                        {index + 1}
                                      </div>
                                      <h4 className="font-semibold">{step.title}</h4>
                                    </div>
                                    
                                    <p className="text-sm text-muted-foreground ml-8">
                                      {step.description}
                                    </p>
                                    
                                    {step.code && (
                                      <div className="ml-8 space-y-2">
                                        <div className="relative">
                                          <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                                            <code>{step.code}</code>
                                          </pre>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="absolute top-2 right-2"
                                            onClick={() => copyToClipboard(step.code!, `${component.id}-${index}`)}
                                          >
                                            {copiedCode === `${component.id}-${index}` ? (
                                              <Check className="h-4 w-4" />
                                            ) : (
                                              <Copy className="h-4 w-4" />
                                            )}
                                          </Button>
                                        </div>
                                        
                                        {step.note && (
                                          <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                                            <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                              {step.note}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                    
                                    {index < component.configGuide.steps.length - 1 && (
                                      <Separator className="ml-8" />
                                    )}
                                  </div>
                                ))}
                              </div>
                            </ScrollArea>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}