import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Params, Router, NavigationEnd } from '@angular/router';

import { Project } from '../project.model';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html'
})
export class ProjectDetailComponent implements OnInit 
{
  pro: Project;
  id: number;
  private innerWidth: any;

    // Get Device size (If you wanna keep it updated on resize)
  @HostListener('window:resize', ['$event']) onResize(event) { this.innerWidth = window.innerWidth; }


  constructor(private projectService: ProjectService,
              private route: ActivatedRoute,
              private router: Router) {
        // Focus on this component (use only on device screen less than 720)
        router.events.subscribe(s => {
          if (s instanceof NavigationEnd) {
            const tree = router.parseUrl(router.url);
            if (tree.fragment && this.innerWidth <= 720) {
              const element = document.querySelector("#" + tree.fragment);
              if (element) { element.scrollIntoView(true); }
            }
          }
        });
  }

  ngOnInit() {
    // Take detail from url
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
          this.pro = this.projectService.getProject(this.id);
        }
      );
    
      // To Get innerwidth size of device
      this.innerWidth = window.innerWidth;
  }

  // Listener to add prerequsite of project
  onAddToShoppingList() 
  {
    this.projectService.addBooksToShoppingList(this.pro.Books);
  }

  // Listener to edit the project
  onEditProject() 
  {
    this.router.navigate(['edit'], {relativeTo: this.route});
   }

   // Listener to delete the project
  onDeleteProject() 
  {
    this.projectService.deleteProject(this.id);
    this.router.navigate(['/projects']);
  }

}
