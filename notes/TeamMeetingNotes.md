# Team Meeting Notes

## 7/12/2020

* Discussed react tutorial.  The tic tac toe is a great way to get started.  Reach out to Aaron for anything that is confusing
* Since Forge allows for an add in to be uploaded and called, this seems like the ideal platform to move forward with
* First steps are to create a basic add in that places a revit family and configures.  Values can all be hard coded to start.  Louis and Aaron will start on this.
* Sahil will set the team up with a Forge account
* Next step wil be to upload the add in to Forge and invoke.
* Once this is working correctly we can make the add in dynamic so that it can place different families with differen sets of parameters.
* Louis inquired about wall penetrations.  Should these be handled as a seperate component or part of the wall family?  Revit doesn't handle these as family properties and this will require unique logic specific to walls.  Walls should probably always allow for penetration 'children' that will perform these operations.  There are probably lots of simmilar cases to this.
* Team will try and meet at 8 PM UTC each day for a check in.  Will try and make these 30 mins max.