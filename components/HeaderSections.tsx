import { LuCalculator,LuBookOpen,LuSparkles,LuExternalLink} from 'react-icons/lu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { ResourceData } from "@/lib/resources"


export default function HeaderSection(){
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-2xl font-bold  font-orbitron tracking-tight text-foreground flex items-center gap-2">
              <LuCalculator className="h-6 w-6 text-primary" />
              ATT-END 
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Attendance Calculator & Student Resource Hub
            </p>
          </div>

          <Dialog>
            <DialogTrigger >
              <div  className="gap-2 text-sm flex border-2 p-4 border-border rounded-none">
                <LuBookOpen className="h-4 w-4" />
                Student Toolkit
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-card text-card-foreground border-border rounded-none max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                  <LuSparkles className="h-5 w-5 text-primary" />
                  Student Toolkit
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Essential tools, developer roadmaps, and free utilities.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 pt-4">
                {ResourceData.map((group, idx) => (
                  <div key={idx} className="space-y-2">
                    <h3 className="text-sm font-semibold text-foreground border-b border-border pb-1">
                      {group.category}
                    </h3>
                    <p className="text-xs text-muted-foreground">{group.description}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {group.links.map((link, lIdx) => (
                        <a
                          key={lIdx}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex flex-col justify-between p-3 border border-border bg-background hover:bg-accent hover:text-accent-foreground transition-colors group rounded-none"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{link.name}</span>
                            <LuExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                          </div>
                          <span className="text-xs text-muted-foreground mt-1">{link.desc}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </header>
  )
}
