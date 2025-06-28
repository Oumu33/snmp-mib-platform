'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, Search, Filter, Download, Trash2, Eye, Edit, CheckCircle2, AlertCircle, Clock, FileCode, Layers, Database, GitBranch, History, Package, Zap, Target, Settings, RefreshCw, Archive, FileCheck, AlertTriangle, Folder, FolderOpen, Server, HardDrive, FileArchive, Grip, FilePlus, FolderPlus, Link, ExternalLink } from 'lucide-react';

interface MIBFile {
  id: string;
  name: string;
  filename: string;
  vendor: string;
  version: string;
  size: string;
  uploadDate: string;
  status: 'validated' | 'parsing' | 'error' | 'pending' | 'extracting';
  oidCount: number;
  dependencies: string[];
  description: string;
  category: string;
  source: 'upload' | 'server' | 'archive';
  archiveName?: string;
  serverPath?: string;
}

interface ServerPath {
  id: string;
  name: string;
  path: string;
  host: string;
  status: 'connected' | 'disconnected' | 'scanning';
  fileCount: number;
  lastScan: string;
  autoSync: boolean;
}

interface ArchiveFile {
  id: string;
  name: string;
  size: string;
  uploadDate: string;
  status: 'uploaded' | 'extracting' | 'extracted' | 'error';
  extractedFiles: number;
  totalFiles: number;
  progress: number;
}

export function MIBManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('library');

  const mibFiles: MIBFile[] = [
    {
      id: '1',
      name: 'CISCO-SWITCH-MIB',
      filename: 'cisco-switch.mib',
      vendor: 'Cisco',
      version: '1.2.3',
      size: '245 KB',
      uploadDate: '2024-01-15',
      status: 'validated',
      oidCount: 1247,
      dependencies: ['SNMPv2-MIB', 'CISCO-SMI'],
      description: 'Cisco switch management MIB for monitoring switch ports and VLANs',
      category: 'Network Equipment',
      source: 'upload'
    },
    {
      id: '2',
      name: 'HUAWEI-ROUTER-MIB',
      filename: 'huawei-router.mib',
      vendor: 'Huawei',
      version: '2.1.0',
      size: '189 KB',
      uploadDate: '2024-01-14',
      status: 'validated',
      oidCount: 892,
      dependencies: ['SNMPv2-MIB', 'HUAWEI-MIB'],
      description: 'Huawei router MIB for routing table and interface monitoring',
      category: 'Network Equipment',
      source: 'server',
      serverPath: '/opt/monitoring/mibs/huawei/'
    },
    {
      id: '3',
      name: 'UPS-MIB',
      filename: 'ups-management.mib',
      vendor: 'APC',
      version: '1.0.5',
      size: '67 KB',
      uploadDate: '2024-01-13',
      status: 'parsing',
      oidCount: 234,
      dependencies: ['SNMPv2-MIB'],
      description: 'UPS monitoring MIB for power management and battery status',
      category: 'Power Management',
      source: 'archive',
      archiveName: 'apc-mibs-v2.zip'
    },
    {
      id: '4',
      name: 'PRINTER-MIB',
      filename: 'printer-std.mib',
      vendor: 'HP',
      version: '3.2.1',
      size: '156 KB',
      uploadDate: '2024-01-12',
      status: 'error',
      oidCount: 0,
      dependencies: ['SNMPv2-MIB', 'HOST-RESOURCES-MIB'],
      description: 'Standard printer MIB for monitoring print jobs and supplies',
      category: 'Printers',
      source: 'upload'
    },
    {
      id: '5',
      name: 'SERVER-HEALTH-MIB',
      filename: 'server-health.mib',
      vendor: 'Dell',
      version: '4.1.2',
      size: '312 KB',
      uploadDate: '2024-01-11',
      status: 'validated',
      oidCount: 1567,
      dependencies: ['SNMPv2-MIB', 'DELL-SMI'],
      description: 'Dell server health monitoring MIB for hardware status',
      category: 'Servers',
      source: 'server',
      serverPath: '/usr/share/snmp/mibs/dell/'
    }
  ];

  const serverPaths: ServerPath[] = [
    {
      id: '1',
      name: 'Monitoring Server - Standard MIBs',
      path: '/usr/share/snmp/mibs/',
      host: '192.168.1.10',
      status: 'connected',
      fileCount: 156,
      lastScan: '2024-01-15 14:30:00',
      autoSync: true
    },
    {
      id: '2',
      name: 'Monitoring Server - Vendor MIBs',
      path: '/opt/monitoring/mibs/',
      host: '192.168.1.10',
      status: 'connected',
      fileCount: 89,
      lastScan: '2024-01-15 14:25:00',
      autoSync: true
    },
    {
      id: '3',
      name: 'SNMP Server - Custom MIBs',
      path: '/var/lib/snmp/mibs/',
      host: '192.168.1.11',
      status: 'disconnected',
      fileCount: 0,
      lastScan: '2024-01-14 10:15:00',
      autoSync: false
    }
  ];

  const archiveFiles: ArchiveFile[] = [
    {
      id: '1',
      name: 'cisco-mibs-complete.zip',
      size: '15.2 MB',
      uploadDate: '2024-01-15 14:30:00',
      status: 'extracted',
      extractedFiles: 45,
      totalFiles: 45,
      progress: 100
    },
    {
      id: '2',
      name: 'vendor-mibs-collection.tar.gz',
      size: '8.7 MB',
      uploadDate: '2024-01-15 14:25:00',
      status: 'extracting',
      extractedFiles: 23,
      totalFiles: 67,
      progress: 34
    },
    {
      id: '3',
      name: 'snmp-standard-mibs.zip',
      size: '3.4 MB',
      uploadDate: '2024-01-15 14:20:00',
      status: 'uploaded',
      extractedFiles: 0,
      totalFiles: 0,
      progress: 0
    }
  ];

  const categories = ['all', 'Network Equipment', 'Power Management', 'Printers', 'Servers', 'Storage'];

  const getStatusIcon = (status: MIBFile['status']) => {
    switch (status) {
      case 'validated':
        return <CheckCircle2 className="h-4 w-4 text-green-400" />;
      case 'parsing':
        return <Clock className="h-4 w-4 text-blue-400 animate-spin" />;
      case 'extracting':
        return <Grip className="h-4 w-4 text-purple-400 animate-pulse" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-400" />;
    }
  };

  const getSourceIcon = (source: MIBFile['source']) => {
    switch (source) {
      case 'upload':
        return <Upload className="h-4 w-4 text-blue-400" />;
      case 'server':
        return <Server className="h-4 w-4 text-green-400" />;
      case 'archive':
        return <Archive className="h-4 w-4 text-purple-400" />;
      default:
        return <FileText className="h-4 w-4 text-gray-400" />;
    }
  };

  const getServerStatusIcon = (status: ServerPath['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle2 className="h-4 w-4 text-green-400" />;
      case 'scanning':
        return <RefreshCw className="h-4 w-4 text-blue-400 animate-spin" />;
      default:
        return <AlertCircle className="h-4 w-4 text-red-400" />;
    }
  };

  const getArchiveStatusIcon = (status: ArchiveFile['status']) => {
    switch (status) {
      case 'extracted':
        return <CheckCircle2 className="h-4 w-4 text-green-400" />;
      case 'extracting':
        return <Grip className="h-4 w-4 text-blue-400 animate-pulse" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      default:
        return <FileArchive className="h-4 w-4 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: MIBFile['status']) => {
    switch (status) {
      case 'validated':
        return 'border-green-500 bg-green-500/10';
      case 'parsing':
        return 'border-blue-500 bg-blue-500/10';
      case 'extracting':
        return 'border-purple-500 bg-purple-500/10';
      case 'error':
        return 'border-red-500 bg-red-500/10';
      default:
        return 'border-yellow-500 bg-yellow-500/10';
    }
  };

  const filteredMIBs = mibFiles.filter(mib => {
    const matchesSearch = mib.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mib.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mib.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || mib.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFileUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const scanServerPath = (pathId: string) => {
    // Simulate server path scanning
    console.log(`Scanning server path: ${pathId}`);
  };

  const extractArchive = (archiveId: string) => {
    // Simulate archive extraction
    console.log(`Extracting archive: ${archiveId}`);
  };

  const validatedCount = mibFiles.filter(m => m.status === 'validated').length;
  const errorCount = mibFiles.filter(m => m.status === 'error').length;
  const totalOIDs = mibFiles.reduce((sum, m) => sum + m.oidCount, 0);
  const serverFiles = mibFiles.filter(m => m.source === 'server').length;

  return (
    <div className="space-y-6">
      {/* MIB Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total MIB Files</p>
                <p className="text-2xl font-bold text-white">{mibFiles.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Server Files</p>
                <p className="text-2xl font-bold text-green-400">{serverFiles}</p>
              </div>
              <Server className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Validated</p>
                <p className="text-2xl font-bold text-green-400">{validatedCount}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total OIDs</p>
                <p className="text-2xl font-bold text-purple-400">{totalOIDs.toLocaleString()}</p>
              </div>
              <Database className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-800/50 border border-slate-700">
          <TabsTrigger value="library">
            <Layers className="h-4 w-4 mr-2" />
            MIB Library
          </TabsTrigger>
          <TabsTrigger value="upload">
            <Upload className="h-4 w-4 mr-2" />
            Upload & Parse
          </TabsTrigger>
          <TabsTrigger value="server">
            <Server className="h-4 w-4 mr-2" />
            Server Paths
          </TabsTrigger>
          <TabsTrigger value="archives">
            <Archive className="h-4 w-4 mr-2" />
            Archives
          </TabsTrigger>
          <TabsTrigger value="validation">
            <FileCheck className="h-4 w-4 mr-2" />
            Validation
          </TabsTrigger>
        </TabsList>

        {/* MIB Library Tab */}
        <TabsContent value="library" className="space-y-6">
          {/* Search and Filter */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">MIB File Library</CardTitle>
              <CardDescription className="text-slate-400">
                Manage and browse your MIB file collection from all sources
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search MIB files, vendors, or descriptions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-slate-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </option>
                    ))}
                  </select>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh All
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* MIB Files Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredMIBs.map((mib) => (
              <Card key={mib.id} className={`border transition-all hover:shadow-lg ${getStatusColor(mib.status)}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(mib.status)}
                      {getSourceIcon(mib.source)}
                      <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                        {mib.category}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-400 hover:text-red-300">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-white text-lg">{mib.name}</h3>
                      <p className="text-sm text-slate-400">{mib.filename}</p>
                    </div>
                    
                    <p className="text-sm text-slate-300 line-clamp-2">{mib.description}</p>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                      <div><strong>Vendor:</strong> {mib.vendor}</div>
                      <div><strong>Version:</strong> {mib.version}</div>
                      <div><strong>Size:</strong> {mib.size}</div>
                      <div><strong>OIDs:</strong> {mib.oidCount.toLocaleString()}</div>
                    </div>
                    
                    {/* Source Information */}
                    {mib.source === 'server' && mib.serverPath && (
                      <div className="p-2 bg-green-500/10 border border-green-500/20 rounded">
                        <div className="flex items-center space-x-2">
                          <Server className="h-3 w-3 text-green-400" />
                          <span className="text-xs text-green-400">Server Path</span>
                        </div>
                        <p className="text-xs text-slate-300 font-mono mt-1">{mib.serverPath}</p>
                      </div>
                    )}
                    
                    {mib.source === 'archive' && mib.archiveName && (
                      <div className="p-2 bg-purple-500/10 border border-purple-500/20 rounded">
                        <div className="flex items-center space-x-2">
                          <Archive className="h-3 w-3 text-purple-400" />
                          <span className="text-xs text-purple-400">From Archive</span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1">{mib.archiveName}</p>
                      </div>
                    )}
                    
                    {mib.dependencies.length > 0 && (
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Dependencies:</p>
                        <div className="flex flex-wrap gap-1">
                          {mib.dependencies.map((dep, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs border-slate-700 text-slate-400">
                              {dep}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center pt-2 border-t border-slate-700">
                      <span className="text-xs text-slate-500">Uploaded: {mib.uploadDate}</span>
                      <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                        <Download className="h-3 w-3 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Upload & Parse Tab */}
        <TabsContent value="upload" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                Upload MIB Files & Archives
              </CardTitle>
              <CardDescription className="text-slate-400">
                Upload individual MIB files or compressed archives with automatic extraction
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Upload Area */}
              <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                <div className="flex justify-center space-x-4 mb-4">
                  <Upload className="h-12 w-12 text-slate-400" />
                  <FileArchive className="h-12 w-12 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Drop MIB files or archives here</h3>
                <p className="text-slate-400 mb-4">
                  Supports: .mib, .txt, .zip, .tar.gz, .tar.bz2, .rar
                </p>
                <div className="flex justify-center space-x-4">
                  <Button onClick={handleFileUpload} className="bg-blue-600 hover:bg-blue-700">
                    <FilePlus className="h-4 w-4 mr-2" />
                    Select Files
                  </Button>
                  <Button onClick={handleFileUpload} variant="outline" className="border-purple-600 text-purple-400">
                    <Archive className="h-4 w-4 mr-2" />
                    Select Archives
                  </Button>
                </div>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <Card className="bg-slate-700/50 border-slate-600">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-300">Uploading vendor-mibs.zip</span>
                      <span className="text-sm text-slate-400">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                    <div className="flex justify-between text-xs text-slate-500 mt-2">
                      <span>Processing archive...</span>
                      <span>15.2 MB / 15.2 MB</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Upload Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Processing Options</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm text-slate-400">Auto-validate after upload</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm text-slate-400">Extract dependencies</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm text-slate-400">Auto-extract archives</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Archive Options</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm text-slate-400">Preserve directory structure</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm text-slate-400">Overwrite existing files</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm text-slate-400">Create backup before overwrite</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Server Paths Tab */}
        <TabsContent value="server" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white flex items-center">
                    <Server className="h-5 w-5 mr-2" />
                    Server MIB Paths
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Configure and monitor MIB file directories on remote servers
                  </CardDescription>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <FolderPlus className="h-4 w-4 mr-2" />
                  Add Server Path
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {serverPaths.map((path) => (
                  <div key={path.id} className="p-4 border border-slate-600 rounded-lg hover:border-blue-500 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getServerStatusIcon(path.status)}
                        <div>
                          <h3 className="font-semibold text-white">{path.name}</h3>
                          <p className="text-sm text-slate-400 font-mono">{path.host}:{path.path}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={`${
                          path.status === 'connected' ? 'bg-green-600' : 
                          path.status === 'scanning' ? 'bg-blue-600' : 'bg-red-600'
                        } text-white text-xs`}>
                          {path.status}
                        </Badge>
                        {path.autoSync && (
                          <Badge className="bg-purple-600 text-white text-xs">Auto-Sync</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 text-sm">
                      <div>
                        <p className="text-slate-500">Files Found</p>
                        <p className="text-white font-semibold">{path.fileCount}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Last Scan</p>
                        <p className="text-white">{path.lastScan}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Auto Sync</p>
                        <p className="text-white">{path.autoSync ? 'Enabled' : 'Disabled'}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Folder className="h-4 w-4 text-slate-400" />
                        <span className="text-xs text-slate-500">
                          {path.status === 'connected' ? 'Ready for sync' : 'Connection required'}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-slate-600 text-slate-300"
                          onClick={() => scanServerPath(path.id)}
                          disabled={path.status !== 'connected'}
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Scan
                        </Button>
                        <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                          <Settings className="h-3 w-3 mr-1" />
                          Configure
                        </Button>
                        <Button size="sm" variant="outline" className="border-blue-600 text-blue-400">
                          <Link className="h-3 w-3 mr-1" />
                          Connect
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Add Server Path Form */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Add New Server Path</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-300">Server Host</Label>
                  <Input 
                    placeholder="192.168.1.10"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">MIB Directory Path</Label>
                  <Input 
                    placeholder="/usr/share/snmp/mibs/"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Display Name</Label>
                  <Input 
                    placeholder="Production Server MIBs"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">SSH Port</Label>
                  <Input 
                    placeholder="22"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked />
                  <span className="text-sm text-slate-400">Enable auto-sync</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" />
                  <span className="text-sm text-slate-400">Recursive scan subdirectories</span>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button variant="outline" className="border-slate-600 text-slate-300">
                  <Target className="h-4 w-4 mr-2" />
                  Test Connection
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <FolderPlus className="h-4 w-4 mr-2" />
                  Add Path
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Archives Tab */}
        <TabsContent value="archives" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Archive className="h-5 w-5 mr-2" />
                Archive Management
              </CardTitle>
              <CardDescription className="text-slate-400">
                Manage uploaded archives and extraction status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {archiveFiles.map((archive) => (
                  <div key={archive.id} className="p-4 border border-slate-600 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getArchiveStatusIcon(archive.status)}
                        <div>
                          <h3 className="font-semibold text-white">{archive.name}</h3>
                          <p className="text-sm text-slate-400">{archive.size} • {archive.uploadDate}</p>
                        </div>
                      </div>
                      <Badge className={`${
                        archive.status === 'extracted' ? 'bg-green-600' :
                        archive.status === 'extracting' ? 'bg-blue-600' :
                        archive.status === 'error' ? 'bg-red-600' : 'bg-yellow-600'
                      } text-white text-xs`}>
                        {archive.status}
                      </Badge>
                    </div>
                    
                    {archive.status === 'extracting' && (
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-400">Extracting files...</span>
                          <span className="text-white">{archive.extractedFiles}/{archive.totalFiles}</span>
                        </div>
                        <Progress value={archive.progress} className="h-2" />
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 text-sm">
                      <div>
                        <p className="text-slate-500">Status</p>
                        <p className="text-white capitalize">{archive.status}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Extracted Files</p>
                        <p className="text-white">{archive.extractedFiles}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Total Files</p>
                        <p className="text-white">{archive.totalFiles || 'Unknown'}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <FileArchive className="h-4 w-4 text-slate-400" />
                        <span className="text-xs text-slate-500">
                          {archive.status === 'extracted' ? 'Extraction completed' : 
                           archive.status === 'extracting' ? 'Extraction in progress' :
                           archive.status === 'uploaded' ? 'Ready for extraction' : 'Extraction failed'}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        {archive.status === 'uploaded' && (
                          <Button 
                            size="sm" 
                            className="bg-purple-600 hover:bg-purple-700"
                            onClick={() => extractArchive(archive.id)}
                          >
                            <Grip className="h-3 w-3 mr-1" />
                            Extract
                          </Button>
                        )}
                        <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" className="border-red-600 text-red-400">
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Validation Tab */}
        <TabsContent value="validation" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <FileCheck className="h-5 w-5 mr-2" />
                MIB Validation & Syntax Check
              </CardTitle>
              <CardDescription className="text-slate-400">
                Validate MIB files and check for syntax errors across all sources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-500/10 border border-green-500 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                    <span className="font-semibold text-green-400">CISCO-SWITCH-MIB</span>
                    <Badge className="bg-blue-600 text-white text-xs">Upload</Badge>
                  </div>
                  <p className="text-sm text-slate-300">Validation successful - 1247 OIDs parsed</p>
                </div>
                
                <div className="p-4 bg-green-500/10 border border-green-500 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                    <span className="font-semibold text-green-400">HUAWEI-ROUTER-MIB</span>
                    <Badge className="bg-green-600 text-white text-xs">Server</Badge>
                  </div>
                  <p className="text-sm text-slate-300 mb-2">Validation successful - 892 OIDs parsed</p>
                  <p className="text-xs text-slate-500">Source: /opt/monitoring/mibs/huawei/</p>
                </div>
                
                <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <span className="font-semibold text-red-400">PRINTER-MIB</span>
                    <Badge className="bg-blue-600 text-white text-xs">Upload</Badge>
                  </div>
                  <p className="text-sm text-slate-300 mb-2">Syntax error on line 245: Missing IMPORTS statement</p>
                  <Button size="sm" variant="outline" className="border-red-500 text-red-400">
                    View Details
                  </Button>
                </div>
                
                <div className="p-4 bg-blue-500/10 border border-blue-500 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="h-5 w-5 text-blue-400 animate-spin" />
                    <span className="font-semibold text-blue-400">UPS-MIB</span>
                    <Badge className="bg-purple-600 text-white text-xs">Archive</Badge>
                  </div>
                  <p className="text-sm text-slate-300 mb-2">Parsing in progress...</p>
                  <p className="text-xs text-slate-500">Source: apc-mibs-v2.zip</p>
                  <Progress value={65} className="h-2 mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}