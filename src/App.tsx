import { IconMicrophone, IconPhone, IconPhoneCall, IconPlus, IconSearch, IconVideo } from "@tabler/icons-react";
import { AppProvider } from "./components/core/app-provider";
import { Avatar, AvatarFallback } from "./components/ui/avatar";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarProvider } from "./components/ui/sidebar";
import { cn } from "./lib/utils";

const App = () => (
	<AppProvider>
		<SidebarProvider>
			<Sidebar collapsible="offcanvas">
				<SidebarHeader className="px-4 py-4">
					<h1 className="font-semibold md:text-lg">Your Chats</h1>
					<Input placeholder="Search chats..." />
				</SidebarHeader>
				<SidebarContent>
					<div className="flex flex-col gap-y-2">
						{Array.from({ length: 15 }).map((_, index) => (
							<div key={index} className="px-4 py-2 flex items-center gap-x-4 cursor-pointer hover:bg-accent">
								<Avatar className="size-12">
									<AvatarFallback className="font-semibold md:text-lg">KH</AvatarFallback>
								</Avatar>
								<div className="w-full flex flex-col gap-y-1">
									<div className="flex items-center justify-between">
										<p className="font-medium">Khen Cahyo</p>
										<span className="text-sm text-muted-foreground">13:00</span>
									</div>
									<div className="text-sm text-muted-foreground">
										<p>This is a sample chat message preview.</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</SidebarContent>
			</Sidebar>
			<SidebarInset>
				<div className="flex h-svh flex-col">
					{/* Chat Header */}
					<div className="flex items-center justify-between bg-sidebar border-b px-4 py-4">
						<div className="flex items-center gap-x-3">
							<Avatar className="size-10">
								<AvatarFallback className="font-semibold">KH</AvatarFallback>
							</Avatar>
							<h1 className="font-medium">Khen Cahyo</h1>
						</div>
						<div className="flex items-center gap-x-3">
							<Button variant='ghost' size='icon'>
								<IconPhone className="size-6 text-muted-foreground" />
							</Button>
							<Button variant='ghost' size='icon'>
								<IconVideo className="size-6 text-muted-foreground" />
							</Button>
							<Button variant='ghost' size='icon'>
								<IconSearch className="size-6 text-muted-foreground" />
							</Button>
						</div>
					</div>

					{/* Chat Content */}
					<div className="flex-1 overflow-y-auto px-4 py-4 md:gap-y-6 flex flex-col gap-y-4">
						{Array.from({ length: 20 }).map((_, index) => (
							<div
								key={index}
								className={cn(
									'px-4 py-2 rounded-md md:max-w-1/2',
									index % 2 === 0 ? 'bg-sidebar self-start rounded-tr-none' : 'bg-accent self-end rounded-tl-none'
								)}
								>
								<p className="text-sm leading-relaxed">Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam nesciunt voluptatibus et officia adipisci quo ipsam distinctio itaque sapiente omnis, praesentium minima libero officiis ipsum hic error corrupti fuga rerum.</p>
							</div>
						))}
					</div>

					{/* Chat Footer */}
					<div className="bg-sidebar border-t shrink-0">
						<div className="flex items-center gap-x-4 px-4 py-4">
							<Button variant='ghost' size='icon'>
								<IconPlus className="size-6 text-muted-foreground" />
							</Button>
							<div className="flex flex-1">
								<Input placeholder="Type a message..." />
							</div>
							<Button variant='ghost' size='icon'>
								<IconMicrophone className="size-6 text-muted-foreground" />
							</Button>
						</div>
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	</AppProvider>
);

export default App;