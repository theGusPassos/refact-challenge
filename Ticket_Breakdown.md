# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

Each Facility will have its own ids for Agents. One Agent can work in multiple Facilities, this means we cannot save the Agent custom id in its own table.

While the current `generateReport` function uses all Agents that worked in that Facility, the new one will receive a list Agents (custom ids) and generate the report with only them.

### Ticket 1 - Create table to store custom Agent IDs (1h)

The table must hold the Facility ID, one Agent ID and the custom ID.

The custom ID might be a string with a small max length (15 - 20).

The custom ID must be indexed for querying and the primary key should be made with (FacilityID, CustomID) to make sure a Facility doesn't have the same custom ID for different Agents.


### Ticket 2 - Add random custom IDs to existing Facility / Agent relationships (1h)

Since we're not starting from a empty database we'll need to fill it with random custom IDs, that can later be edited by the Facility owners.

This can be a job that runs together with the migrations or can be applied after manually since it'll happen only once. 

_We could also just use the default id when there's no custom, but that'll create an issue with later functions that will expect the custom id. Instead of handling both cases we force one_


### Ticket 3 - Create screen to register Agents custom ids (3h)

The screen will allow the user to select an Agent and edit the custom ID.

The endpoint for creating the relationship must check if the ID is already used by this Facility and if the Agent is active.

Also the current view of Agents must be updated to show the custom id.

_Integration and unit tests must be included._


### Ticket 4 - Create screen to generate report based on selected agents (4h)

The current screen used to generate can be used, but now with another option to select Agents by their custom IDs. If any is selected we can just send in the get request as query params and the back-end will call the correct function.

The endpoint edited will not call `getShiftsByFacility`, and instead call a new function that will return the same type of data, but will receive custom IDs. It can be called `getShiftsByAgentCustomIds(facilityId, agentIds[])`.


### Ticket 5 - Handling new Agents for Facilities (1h)

_The Facility will only need to set a custom ID for Agents whenever booking it for the first time. I'm assuming this screen is already done._

Add field for custom ID when booking an Agent for the first time.

_Integration and unit tests must be included in the endpoint update._