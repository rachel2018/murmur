$(document).ready(function(){ 
	groups_table = $('#groups-table').dataTable({
		"sDom": '<"top"f<"clear">>rt<"bottom"ilp<"clear">>',
		"bPaginate": false,
		"bInfo": false,
		"bAutoWidth": false,
		"bFilter": false,
		"sWidth": "100%",
		"aoColumns": [                 
			{"bSortable": false, "sWidth": "100%"}
		]  
	});
	
	members_table = $('#members-table').dataTable({
		"sDom": '<"top"f<"clear">>rt<"bottom"ilp<"clear">>',
		"bPaginate": false,
		"bInfo": false,
		"bAutoWidth": false,
		"bFilter": false,
		"sWidth": "100%",
		"aoColumns": [                 
			{"bSortable": false, "sWidth": "50%"},
			{"bSortable": false, "sWidth": "10%"},
			{"bSortable": false, "sWidth": "10%"},
			{"bSortable": false, "sWidth": "10%"},
			{"bSortable": false, "sWidth": "10%"},
			{"bSortable": false, "sWidth": "10%"}
		]  
	});
	
	list_groups = 
		function(params){
			$.post('list_groups', params, 
				function(res){
					populate_groups_table(res);
				}
			);	
		}	
	
	group_info = 
		function(params){
			$.post('group_info', params, 
				function(res){
					populate_group_options(res);
					populate_members_table(res);
					highlight_table_row(groups_table, params.curr_row);
				}
			);	
		}
	
	
	create_group = 
		function(params){
			$.post('create_group', params, 
				function(res){
					list_groups(params);
				}
			);	
		}

	subscribe_group = 
		function(params){
			$.post('subscribe_group', params, 
				function(res){
					group_info(params);
					//notify(res);
				}
			);	
		}
		
		
	unsubscribe_group = 
		function(params){
			$.post('unsubscribe_group', params, 
				function(res){
					group_info(params);
					//notify(res);
				}
			);	
		}

	activate_group = 
		function(params){
			$.post('activate_group', params, 
				function(res){
					group_info(params);
					//notify(res);
				}
			);	
		}
		
	
	deactivate_group = 
		function(params){
			$.post('deactivate_group', params, 
				function(res){
					group_info(params);
					//notify(res);
				}
			);	
		}				  


	function bind(fnc, val ) {
		return function () {
			return fnc(val);
		};
	}

	function populate_groups_table(res){
		groups_table.fnClearTable();
		if(res.status){
			var params = {'requester_email': res.user};
			var crt_group = bind(create_group, params);
			$("#btn-crt-group").click(crt_group);
			for(var i = 0; i< res.groups.length; i++){
				curr = groups_table.fnAddData( [
									res.groups[i].name
								  ]);
				var params = {'requester_email': res.user, 
							  'group_name': res.groups[i].name,
							  'curr_row': curr
							 }
				var f = bind(group_info, params)
				curr_row = groups_table.fnGetNodes(curr);
				$(curr_row).click(f);
			}
		}
	}
	
	function populate_members_table(res){
		$('#main-area').show()
		members_table.fnClearTable();
		for(var i = 0; i< res.members.length; i++){
			curr = members_table.fnAddData( [
								res.members[i].email,
								res.members[i].active,
								res.members[i].admin,
								res.members[i].moderator,
								res.members[i].member,
								res.members[i].guest
							  ]);
		}
		
	}
	
	function populate_group_options(res, curr_row){
		var params = {'requester_email': res.user, 
					  'group_name': res.group_name,
					  'curr_row': curr_row
					 }
		var act_group = bind(activate_group, params);
		var deact_group = bind(deactivate_group, params);
		var sub_group = bind(subscribe_group, params);
		var unsub_group = bind(unsubscribe_group, params);
		$("#btn-act-group").click(act_group);
		$("#btn-deact-group").click(deact_group);
		$("#btn-sub-group").click(sub_group);
		$("#btn-unsub-group").click(unsub_group);
	}
	
	function highlight_table_row(table, curr_row){
		if(curr_row !== undefined){
			$('td', table.fnGetNodes()).css("background-color","white");
			$('td', table.fnGetNodes(curr_row)).css("background-color","lightyellow");
		}	
	}
	
	if(window.location.pathname.indexOf('/settings')!=-1){
		list_groups();
	}
});

				
	




