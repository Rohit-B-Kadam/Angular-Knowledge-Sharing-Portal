import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Params, Router, NavigationEnd } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

import { ProjectService } from '../project.service';

/** Selector **/
@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.css']
})

/** Class */
export class ProjectEditComponent implements OnInit {
  
  //Property
  id: number;
  public editMode = false;
  proForm: FormGroup;
  private fragment: string;
  private innerWidth: any;

  //Constructor
  constructor(  private route: ActivatedRoute,
                private projectService: ProjectService,
                private router: Router
              ) 
  {
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

  // Get Device size (If you wanna keep it updated on resize)
  @HostListener('window:resize', ['$event']) onResize(event) { this.innerWidth = window.innerWidth; }

  ngOnInit() {

    // Filling reduired data from URL
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];  // get project id
          this.editMode = params['id'] != null; // check if the component is open for edit or create new project
          this.initForm();  // Initializing Form
        }
      );
    
    // To Get innerwidth size of device
    this.innerWidth = window.innerWidth;
  }


  public onSubmit(): void 
  {
    if (this.editMode) 
    {
      this.projectService.updateProject(this.id, this.proForm.value);
    }
    else 
    {
      this.projectService.addProject(this.proForm.value);
    }

    this.onCancel();
  }

  // when user click 'add Prerequisite for Project' button
  public onAddBook() 
  {
    (<FormArray>this.proForm.get('Books')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)
        ])
      })
    );
  }

  // when user click 'Remove' button
  onDeleteBook(index: number) 
  {
    (<FormArray>this.proForm.get('Books')).removeAt(index);
  }

  onCancel() 
  {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  // Init Form
  private initForm() 
  {
    let proName = '';
    let proImagePath = '';
    let proDescription = '';
    let proBooks = new FormArray([]);

    // If this component is open for update existing project
    if (this.editMode) {
      const pro = this.projectService.getProject(this.id);
      proName = pro.name;
      proImagePath = pro.imagePath;
      proDescription = pro.description;
      if (pro['Books']) {
        for (let Book of pro.Books) {
          proBooks.push(
            new FormGroup({
              'name': new FormControl(Book.name, Validators.required),
              'amount': new FormControl(Book.amount, [
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/)
              ])
            })
          );
        }
      }
    }

    this.proForm = new FormGroup({
      'name': new FormControl(proName, Validators.required),
      'imagePath': new FormControl(proImagePath, Validators.required),
      'description': new FormControl(proDescription, Validators.required),
      'Books': proBooks
    });
  }
}
