<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>
        @if ($reportType === 'users')
            {{ $reportTitle . ' - ' . now()->format('Y-m-d') }}
        @elseif ($reportType === 'tickets')
            {{ $reportTitle . ' - ' . now()->format('Y-m-d') }}
        @elseif ($reportType === 'incidents')
            {{ $reportTitle . ' - ' . now()->format('Y-m-d') }}
        @elseif ($reportType === 'cancellations')
            {{ $reportTitle . ' - ' . now()->format('Y-m-d') }}
        @elseif ($reportType === 'volume')
            {{ $reportTitle . ' - ' . now()->format('Y-m-d') }}
        @elseif ($reportType === 'service')
            {{ $reportTitle . ' - ' . now()->format('Y-m-d') }}
        @elseif ($reportType === 'performance')
            {{ $reportTitle . ' - ' . now()->format('Y-m-d') }}
        @elseif ($reportType === 'audit')
            {{ $reportTitle . ' - ' . now()->format('Y-m-d') }}
        @endif
    </title>
    <style>
        @page {
            @if (!empty($reportScope))
                margin: 300px 0px 55px 0px;
            @else
                margin: 250px 0px 50px 0px;
            @endif
        }

        body {
            font-family: 'Bookman Old Style', 'Bookman', 'serif';
        }

        header {
            position: fixed;
            @if(!empty($reportScope))
                top: -280px;
            @else
                top: -230px;
            @endif
            left: 0px;
            right: 0px;
            height: 110px;

            /** Extra styling **/
            text-align: center;
        }
        header .header-table {
            width: 100%;
            border-collapse: collapse;
            padding: 15px 30px;

        }
        header .header-table td, header .header-table th, header .header-table tr {
            border: none;
        }

        footer {
            position: fixed;
            @if (!empty($reportScope))
                bottom: -45px;
            @else
                bottom: -40px;
            @endif
            left: 0px;
            right: 0px;
            height: 50px;
        }

        footer .footer-table {
            width: 100%;
            border-collapse: collapse;
            padding: 15px 30px;
            border: none;
            border-top: 1px solid #000;
        }

        footer .footer-table td, footer .footer-table th, footer .footer-table tr {
            border: none;
        }

        .report-header {
            padding: 5px 30px;
        }
        .report-header .report-header-table-header {
                text-align: center;
                background-color: #f2f2f2;
                border: 1px solid #000;
                padding: 6px;
        }
        .report-header .report-header-table-header p {
            margin: 0;
            font-size: 14px;
            font-weight: bold;
        }
        .report-header tr td{
            width: 50%;
        }

        main {
            /* border:#000 1px solid; */
             /* For debugging page breaks, remove in production */
             padding: 0px 30px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th, td {
            padding: 8px;
            text-align: left;
            border: 1px solid #000000;
        }

        thead {
            display: table-header-group;
        }

        tr {
            page-break-inside: avoid;
        }

        .main-table-header {
            background-color: #f2f2f2;
            border: 1px solid #000;
            padding: 6px;
        }

        .main-table-header th {
                text-align: left;
            margin: 0;
            font-size: 14px;
            font-weight: bold;
        }

        .bold-text-cell {
            margin: 0;
            font-weight: bold;
        }
        .small-text-cell {
            margin: 0;
            font-size: 12px;
        }

        .id_cell {
            font-family: 'Courier New', Courier, monospace;
            font-size: 12px;
            text-align: center;
            width: 5%;
        }

        .pagenum:before { content: counter(page); }
        .pagecount:before { content: counter(pages); }

    </style>
</head>
<body>
    <header>
        <table class="header-table">
            <tr>
                <td style="width: 20%; vertical-align: middle; text-align: center;">
                    <img src="{{ public_path('lra-new-logo.jpg') }}" width="85">
                </td>
                <td style="text-align: center; width: 60%;">
                    <p style="margin: 0; font-size: 12px;">Republika ng Pilipinas</p>
                    <p style="margin: 0; font-size: 12px;">KAGAWARAN NG KATARUNGAN</p>
                    <p style="margin: 0; font-size: 14px; font-weight: bold;">PANGANGASIWA SA PANTALAAN NG LUPAIN</p>
                    <p style="margin: 0; font-size: 14px; font-weight: bold;">(LAND REGISTRATION AUTHORITY)</p>
                    <p style="margin: 0; font-size: 10px;">East Ave. cor. NIA Rd., Diliman, Quezon City</p>
                </td>
                <td style="width: 20%; font-size: 10px; vertical-align: middle; text-align: right">ICTD Help Desk</td>
            </tr>
        </table>
        <table class="report-header">
            <tr>
                <td colspan="2" class="report-header-table-header">
                    <p>{{ $reportTitle }}</p>
                </td>
            </tr>
            <tr>
                <td>
                    <div>
                        <p style="margin: 0; font-size: 10px;">Generated by</p>
                        <p style="margin: 0; font-weight: bold; font-size: 14px;">{{ $genBy }}</p>
                    </div>
                </td>
                <td>
                <div>
                        <p style="margin: 0; font-size: 10px;">Reporting Period:</p>
                        <p style="margin: 0; font-weight: bold; font-size: 14px;">
                            @if(is_array($period))
                                {{ $period['period'] }} <span style="font-weight: normal; font-size: 12px;">({{ $period['startDate'] }} to {{ $period['endDate'] }})</span>
                            @else
                                {{ $period }}
                            @endif

                        </p>

                    </div>
                </td>
            </tr>
            @if (!empty($reportScope))
                <tr>
                    <td colspan="2">
                        <div>
                            <p style="margin: 0; font-size: 10px;">Report Scope</p>
                            <p style="margin: 0; font-weight: bold; font-size: 14px;">
                                @foreach ($reportScope as $index => $scope)
                                    {{ $scope }} @if($index < count($reportScope) - 1), @endif
                                @endforeach
                            </p>
                        </div>
                    </td>
                </tr>
            @endif

        </table>
    </header>

    <footer>
        <table class="footer-table" style="width: 100%; table-layout: fixed;">
            <tr>
                <td style="text-align: left; font-size: 9px; width: 33.3%;">
                    <p style="margin: 0">Report ID:</p>
                    <p style="margin: 0; font-size: 12px; font-weight: bold;">RPT-ID-0001</p>
                </td>

                <td style="text-align: center; width: 34%; vertical-align: middle;">
                    <p style="margin: 0; font-size: 10px;">
                        Page <span class="pagenum"></span> of <span class="pagecount"></span>
                    </p>
                </td>

                <td style="text-align: right; font-size: 10px; width: 33.3%;">
                    <p style="margin: 0">Timestamp:</p>
                    <p style="margin: 0; font-size: 12px; font-weight: bold;">{{ now()->format('M d, Y g:i A') }}</p>
                </td>
            </tr>
        </table>
    </footer>

    <main>
        @if(isset($summary) && count($summary) > 0)
            <table class="summary-table">
                <thead>
                    <tr class="main-table-header">
                        <th colspan={{ $reportType ==='performance' || $reportType === 'audit' || $reportType === 'assignment' ? 1 : 2 }} style="text-align: center">{{ $reportSummaryTitle ?? 'Report Summary' }}</th>
                    </tr>
                </thead>
                <tbody>
                    @if ($reportType === 'incidents')
                        @foreach ($summary as $chunk)
                            <tr>
                                @foreach ($chunk as $item)
                                    <td style="width: 50%;">
                                        <table style="width: 100%; border-collapse: collapse;">
                                            <tr>
                                                <td style="border: 0">
                                                    <p class="bold-text-cell">{{ $item['name'] ?? 'N/A' }}</p>
                                                    <p class="small-text-cell">{{ $item['activityCode'] ?? '' }}</p>
                                                </td>
                                                <td style="border: 0; text-align: right;">
                                                    <p class="bold-text-cell" style="margin: 0; font-size: 20px;">
                                                        {{ $item['tickets_count'] ?? 0 }}
                                                    </p>
                                                    <p class="small-text-cell" style="margin: 0">Total Tickets</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                @endforeach
                            </tr>
                        @endforeach
                    @elseif ($reportType === 'cancellations')
                        <tr>
                            @foreach ($summary as $chunk)
                                <td style="width: 50%">
                                    {{-- <p class="bold-text-cell">{{ $chunk['label'] ?? 'N/A' }}</p> --}}
                                    <table>
                                        <tr>
                                            <td style="border: 0">
                                                <p class="bold-text-cell">{{ $chunk['label'] ?? 'N/A' }}</p>
                                                <p class="small-text-cell">{{ $chunk['description'] ?? 'N/A' }}</p>
                                            </td>
                                            <td style="border: 0; text-align: right;">
                                                <p class="bold-text-cell" style="margin: 0; font-size: 20px;">
                                                    {{ $chunk['value'] ?? 0 }}
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            @endforeach
                        </tr>
                    @elseif ($reportType === 'volume')
                        @foreach ($summary as $chunk)
                        <tr>
                            @foreach ($chunk as $item)
                                <td style="width: 50%;">
                                    <table style="width: 100%; border-collapse: collapse;">
                                        <tr>
                                            <td style="border: 0">
                                                <p class="bold-text-cell">{{ $item['name'] ?? 'N/A' }}</p>
                                                <p class="small-text-cell">{{ $item['description'] ?? '' }}</p>
                                            </td>
                                            <td style="border: 0; text-align: center; width: 30%;">
                                                <p class="bold-text-cell" style="margin: 0; font-size: 20px;">
                                                    {{ $item['tickets_count'] ?? 0 }}
                                                </p>
                                                <p class="small-text-cell" style="margin: 0">Total Tickets</p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            @endforeach
                        </tr>
                        @endforeach
                    @elseif ($reportType === 'service')
                        <tr>
                            @foreach ($summary as $chunk)
                            <td style="width: 50%;">
                                <table style="width: 100%; border-collapse: collapse;">
                                        <tr>
                                            <td style="border: 0">
                                                <p class="bold-text-cell">{{ $chunk['label'] ?? 'N/A' }}</p>
                                                <p class="small-text-cell">{{ $chunk['description'] ?? '' }}</p>
                                            </td>
                                            <td style="border: 0; text-align: center; width: 30%;">
                                                <p class="bold-text-cell" style="margin: 0; font-size: 20px;">
                                                    {{ $chunk['value'] ?? 0 }}
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
                            </td>
                            @endforeach
                        </tr>
                    @elseif ($reportType === 'performance')
                        <tr>
                            <td style="margin:0; padding:0; border: 0;">
                                <table style="width: 100%; border-collapse: collapse; border: 1px solid #000;">
                                    <tr>
                                        <td style="width: 50%">
                                            <div>
                                                <p class="small-text-cell">Officer Name</p>
                                                <p class="bold-text-cell">
                                                    {{ $summary['firstName'] ?? 'N/A' }} {{ $summary['middleName'] ? substr($summary['middleName'], 0, 1) . '.' : '' }} {{ $summary['lastName'] ?? 'N/A' }}
                                                </p>
                                            </div>
                                        </td>
                                        <td style="width: 50%">
                                            <div>
                                                <p class="small-text-cell">Employee ID</p>
                                                <p class="bold-text-cell">
                                                    {{ $summary['employeeID'] ?? 'N/A' }}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="width: 50%">
                                            <div>
                                                <p class="small-text-cell">Designation</p>
                                                <p class="bold-text-cell">
                                                    {{ $summary['designation'] ?? 'N/A' }}
                                                </p>
                                            </div>
                                        </td>
                                        <td style="width: 50%">
                                            <div>
                                                <p class="small-text-cell">Office/Department/Division</p>
                                                <p class="bold-text-cell">
                                                    {{ $summary['office_department_division']['name'] ?? 'N/A' }}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="width: 50%">
                                            <div>
                                                <p class="small-text-cell">Assigned Tickets</p>
                                                <p class="bold-text-cell">
                                                    {{ $summary['assigned_tickets'] ? count($summary['assigned_tickets']) :  0 }} Tickets
                                                </p>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <p class="small-text-cell">Account Role</p>
                                                <p class="bold-text-cell">
                                                    {{ $summary['accountroles']['name'] ?? 'N/A' }}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    @elseif ($reportType === 'audit')
                        <tr>
                            <td style="margin:0; padding:0; border: 0;">
                                <table style="width: 100%; border-collapse: collapse; border: 1px solid #000;">
                                    <tr>
                                        <td style="width: 50%">
                                            <div>
                                                <p class="small-text-cell">Officer Name</p>
                                                <p class="bold-text-cell">
                                                    {{ $summary['firstName'] ?? 'N/A' }} {{ $summary['middleName'] ? substr($summary['middleName'], 0, 1) . '.' : '' }} {{ $summary['lastName'] ?? 'N/A' }}
                                                </p>
                                            </div>
                                        </td>
                                        <td style="width: 50%">
                                            <div>
                                                <p class="small-text-cell">Employee ID</p>
                                                <p class="bold-text-cell">
                                                    {{ $summary['employeeID'] ?? 'N/A' }}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="width: 50%">
                                            <div>
                                                <p class="small-text-cell">Designation</p>
                                                <p class="bold-text-cell">
                                                    {{ $summary['designation'] ?? 'N/A' }}
                                                </p>
                                            </div>
                                        </td>
                                        <td style="width: 50%">
                                            <div>
                                                <p class="small-text-cell">Office/Department/Division</p>
                                                <p class="bold-text-cell">
                                                    {{ $summary['office_department_division']['name'] ?? 'N/A' }}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="width: 50%">
                                            <div>
                                                <p class="small-text-cell">Activity Created</p>
                                                <p class="bold-text-cell">
                                                    {{ $summary['totalActivity'] ? $summary['totalActivity'] :  0 }} Account Activities
                                                </p>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <p class="small-text-cell">Account Role</p>
                                                <p class="bold-text-cell">
                                                    {{ $summary['accountroles']['name'] ?? 'N/A' }}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    @elseif ($reportType === 'assignment')
                        <tr>
                            <td style="margin:0; padding:0; border: 0;">
                                <table style="width: 100%; border-collapse: collapse; border: 1px solid #000;">
                                    <tr>
                                        <td style="width: 50%">
                                            <div>
                                                <p class="small-text-cell">Officer Name</p>
                                                <p class="bold-text-cell">
                                                    {{ $summary['firstName'] ?? 'N/A' }} {{ $summary['middleName'] ? substr($summary['middleName'], 0, 1) . '.' : '' }} {{ $summary['lastName'] ?? 'N/A' }}
                                                </p>
                                            </div>
                                        </td>
                                        <td style="width: 50%">
                                            <div>
                                                <p class="small-text-cell">Employee ID</p>
                                                <p class="bold-text-cell">
                                                    {{ $summary['employeeID'] ?? 'N/A' }}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="width: 50%">
                                            <div>
                                                <p class="small-text-cell">Designation</p>
                                                <p class="bold-text-cell">
                                                    {{ $summary['designation'] ?? 'N/A' }}
                                                </p>
                                            </div>
                                        </td>
                                        <td style="width: 50%">
                                            <div>
                                                <p class="small-text-cell">Office/Department/Division</p>
                                                <p class="bold-text-cell">
                                                    {{ $summary['office_department_division']['name'] ?? 'N/A' }}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="width: 50%">
                                            <div>
                                                <p class="small-text-cell">Assigned Tickets</p>
                                                <p class="bold-text-cell">
                                                    {{ $summary['assigned_tickets'] ? count($summary['assigned_tickets']) :  0 }} Tickets
                                                </p>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <p class="small-text-cell">Account Role</p>
                                                <p class="bold-text-cell">
                                                    {{ $summary['accountroles']['name'] ?? 'N/A' }}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    @endif

                </tbody>
            </table>
            <br> {{-- Space between summary and main table --}}
        @endif

        @if(isset($breakdown) && count($breakdown) > 0)
            <table class="summary-table">
                <thead>
                    <tr class="main-table-header">
                        <th colspan={{ ($reportType === 'performance') ? count($breakdownHeader) :  count($breakdown)  }} style="text-align: center">{{ $breakdownTitle ?? 'Report Summary' }}</th>
                    </tr>
                    @if ($reportType === 'performance' && isset($breakdownHeader) && count($breakdownHeader) > 0)
                        <tr class="main-table-header">
                            @foreach ($breakdownHeader as $header)
                                <th style="text-align: center;">{{ $header }}</th>
                            @endforeach
                        </tr>
                    @endif
                </thead>
                <tbody>
                    @if ($reportType === 'service')
                    <tr>
                        @foreach ($breakdown as $item)
                            <td style="width: {{ 100 / count($breakdown) }}%; text-align: center;">
                                <p class="bold-text-cell" style="margin: 0; font-size: 16px;">
                                    {{ $item['value'] ?? 0 }}
                                </p>
                                <p class="small-text-cell" style="margin: 0; font-size: 12px;">
                                    {{ $item['label'] ?? 'N/A' }}
                                </p>
                            </td>
                        @endforeach
                    </tr>
                    @elseif ($reportType === 'performance')
                        @foreach ($breakdown as $index => $item)
                            <tr class={{ $index === count($breakdown)-1  ? "main-table-header" : ""}}>
                                <td style="width: 25%; text-align: center;">
                                    <p class="bold-text-cell" style="margin: 0; font-size: 16px;">
                                        {{ $item['label'] ?? 'N/A' }}
                                    </p>
                                </td>
                                <td style="width: 25%; text-align: center;">
                                    <p class="bold-text-cell" style="margin: 0; font-size: 16px;">
                                        {{ $item['value'] ?? 0 }}
                                    </p>
                                </td>
                                <td style="width: 25%; text-align: center;">
                                    <p class="bold-text-cell" style="margin: 0; font-size: 16px;">
                                        {{ $item['percentage'] ?? 'N/A' }}%
                                    </p>
                                </td>
                                <td style="width: 25%; text-align: center;">
                                    <p class="small-text-cell" style="margin: 0; font-size: 12px;">
                                        {{ $item['interpretation'] ?? 'N/A' }}
                                    </p>
                                </td>
                            </tr>
                        @endforeach
                    @endif
                </tbody>
            </table>
            <br/>
        @endif


        <table>
            <thead>
                <tr class="main-table-header">
                    <th colspan="{{ count($headers) + 1 }}" style="text-align: center">{{ $tableTitle }}</th>
                </tr>
                @if($reportType !== "performance")
                <tr class="main-table-header">
                    <th>No.</th>
                    @foreach ($headers as $header)
                        <th>{{ $header }}
                    @endforeach
                </tr>
                @endif
            </thead>
            <tbody>
                {{-- @if (count($data) === 0)
                    <tr>
                        <td colspan="{{ count($headers) + 1 }}" style="text-align: center; padding: 30px">No data available.</td>
                    </tr>
                @endif --}}
                @forelse ($data as $index => $row)
                    <tr>
                        @if($reportType === 'users')
                            <td class="id_cell">{{ $index + 1 }}</td>
                            <td>{{ $row['employeeID'] ?? 'N/A' }}</td>
                            <td>{{ $row['firstName'] ?? 'N/A' }} {{ $row["middleName"] ? substr($row["middleName"], 0, 1) . ".": ' '  }} {{ $row['lastName'] ?? 'N/A' }}</td>
                            <td>
                                <div>
                                    <p class="bold-text-cell">{{ $row['designation'] ?? 'N/A' }}</p>
                                    <p class="small-text-cell">{{ $row['office_department_division']['name'] ?? 'N/A' }}</p>
                                </div>
                            </td>
                            <td>{{ $row['accountroles']['name'] ?? 'N/A' }}</td>
                        @elseif($reportType === 'tickets')
                            <td class="id_cell">{{ $index +1 }}</td>
                            <td style="width: 55%;">
                                <div>
                                    <p class="bold-text-cell" style="font-size: 14px">{{ $row['activitySpecification']['name'] ?? 'N/A' }}</p>
                                    <p class="small-text-cell">{{ $row['activity']['name'] ?? 'N/A' }}</p>
                                    <p class="small-text-cell" style="font-size: 12px; margin-top: 2px;">Asset No: {{ $row['assetNumber'] ?? 'N/A' }}</p>
                                </div>
                            </td>
                            <td>
                                <div>
                                    <p class="bold-text-cell" style="font-size: 14px">{{ $row['requester']['name'] ?? 'N/A' }}</p>
                                    <p class="small-text-cell">{{ $row['requester']['office_department_division']['name'] ?? 'N/A' }}</p>
                                </div>

                            </td>
                            <td>
                                <p class="bold-text-cell" style="font-size: 14px"> {{ $row['status']['name'] ?? 'N/A' }}</p>
                            </td>
                        @elseif($reportType === 'incidents')
                            <td class="id_cell">{{ $index +1 }}</td>
                            <td>
                                <div>
                                    <p class="bold-text-cell">{{ $row['name'] ?? 'N/A' }} <span class="small-text-cell">- {{$row['code'] ?? 'N/A'}}</span> </p>
                                    <p class="small-text-cell">{{ $row['related_activity']['name'] ?? 'N/A' }}</p>
                                </div>
                            </td>
                            <td style="width: 20%;">
                                <div style="text-align: center;">
                                    <p class="bold-text-cell">{{ $row['tickets_count'] ?? 'N/A' }}</p>
                                    <p class="small-text-cell">Total Tickets</p>
                                </div>
                            </td>
                        @elseif($reportType === 'cancellations')
                            <td class="id_cell">{{ $index +1 }}</td>
                            <td>
                                <p class="bold-text-cell">
                                    {{ $row['label'] ?? 'N/A' }}</td>
                                </p>
                            <td>
                                <p class="bold-text-cell">
                                    {{ $row['cancelled_tickets'] ?? 'N/A' }} <span class="small-text-cell" style="font-size: 12px; font-weight: normal;">Tickets</span></td>
                                </p>
                            <td class="bold-text-cell">{{ $row['percentage'] ?? 'N/A' }}%</td>
                        @elseif($reportType === 'volume')
                            <td class="id_cell">{{ $index +1 }}</td>
                            <td style="margin:0; padding:0;">
                                <table style="width: 100%; border-collapse: collapse; border-bottom: 1px solid #000;">
                                    <tr>
                                        <td style="border: 0; width: 70%; vertical-align: middle;">
                                                <p class="bold-text-cell">{{ $row['name'] ?? 'N/A' }}</p>
                                                <p class="small-text-cell">{{ $row['officeCode'] ?? 'N/A' }}</p>
                                        </td>
                                        <td style="text-align: right; width: 30%; border: 0;">
                                            <p class="bold-text-cell" style="margin: 0; font-size: 20px;">
                                                {{ $row['tickets_count'] ?? 0 }}
                                            </p>
                                            <p class="small-text-cell" style="margin: 0">Total Tickets</p>
                                        </td>
                                    </tr>
                                </table>
                                <table style="width: 100%; table-layout: fixed; border-collapse: collapse; border-style: hidden;">
                                    <tr>
                                        @foreach ($row['breakdown'] as $breakdown)
                                            <td style="text-align: center; border: 1px solid #000; padding: 4px; vertical-align: middle;">
                                                <p class="bold-text-cell" style="margin: 0; font-size: 14px;">
                                                    {{ $breakdown['count'] ?? 0 }}
                                                </p>
                                                <p class="small-text-cell" style="margin: 0; font-size: 10px;">
                                                    {{ $breakdown['label'] ?? 'N/A' }} Tickets
                                                </p>
                                            </td>
                                        @endforeach
                                    </tr>
                                </table>
                            </td>
                        @elseif ($reportType === 'service')
                            <td class="id_cell">{{ $index +1 }}</td>
                            <td style="margin:0; padding:0;">
                                <table style="width: 100%; border-collapse: collapse; border-bottom: 1px solid #000;">
                                    <td style="border: 0; width: 70%; vertical-align: middle;">
                                        <p class="bold-text-cell">{{ $row['name'] ?? 'N/A' }}</p>
                                    </td>
                                    <td style="text-align: right; width: 30%; border: 0;">
                                        <p class="bold-text-cell" style="margin: 0; font-size: 20px;">
                                            {{ $row['average'] ?? 0 }}
                                        </p>
                                        <p class="small-text-cell" style="margin: 0;">Average Satisfaction Rate</p>
                                    </td>
                                </table>
                                <table style="width: 100%; table-layout: fixed; border-collapse: collapse; border-style: hidden;">
                                    <tr>
                                        @foreach ($row['breakdown'] as $breakdown)
                                            <td style="text-align: center; border: 1px solid #000; padding: 4px; vertical-align: middle;">
                                                <div style="text-align: center">
                                                    <p class="bold-text-cell">{{ $breakdown['average'] ?? 0 }}</p>
                                                    <p class="small-text-cell">{{ $breakdown['dimension'] ?? 'N/A' }}</p>
                                                </div>
                                            </td>
                                        @endforeach
                                    </tr>
                                </table>
                            </td>
                        @elseif($reportType === "performance")
                            <td style="margin:0; padding: 0">
                                <div>
                                    <table>
                                        <tr class="main-table-header" style="border: 0;">
                                            <td style="border: 0;" colspan="2">
                                                <p class="bold-text-cell" style="text-align: center">
                                                    {{ strtoupper($index ?? 'N/A') }}
                                                </p>
                                            </td>
                                        </tr>
                                        @forelse ( $row as $itemIndex => $item )
                                            <tr>
                                                <td class="id_cell">{{ $itemIndex }}</td>
                                                <td>{{ $item }}</td>
                                            </tr>
                                        @empty
                                            <tr>
                                                <td colspan="2" style="text-align: center; padding: 10px;">No {{ $index }} for the officer.</td>
                                            </tr>
                                        @endforelse
                                    </table>
                                </div>
                            </td>

                        @elseif($reportType === "audit")
                            <td class="id_cell">{{ $index + 1 }}</td>
                            <td width="30%">{{ $row['timestamp'] ?? 'N/A' }}</td>
                            <td class="bold-text-cell">{{ $row['target'] ?? 'N/A' }}</td>
                            <td>{{ $row['event'] ?? 'N/A' }}</td>
                            <td width="40%">{{ $row['message'] ?? 'N/A' }}</td>
                        @elseif($reportType === "assignment")
                            <td class="id_cell">{{ $index +1 }}</td>
                            <td style="width: 55%;">
                                <div>
                                    <p class="bold-text-cell" style="font-size: 14px">{{ $row['activitySpecification']['name'] ?? 'N/A' }}</p>
                                    <p class="small-text-cell">{{ $row['activity']['name'] ?? 'N/A' }}</p>
                                    <p class="small-text-cell" style="font-size: 12px; margin-top: 2px;">Asset No: {{ $row['assetNumber'] ?? 'N/A' }}</p>
                                </div>
                            </td>
                            <td>
                                <div>
                                    <p class="bold-text-cell" style="font-size: 14px">{{ $row['requester']['name'] ?? 'N/A' }}</p>
                                    <p class="small-text-cell">{{ $row['requester']['office_department_division']['name'] ?? 'N/A' }}</p>
                                </div>

                            </td>
                            <td>
                                <p class="bold-text-cell" style="font-size: 14px"> {{ $row['status']['name'] ?? 'N/A' }}</p>
                            </td>
                        @endif
                    </tr>
                @empty
                    <tr>
                        <td colspan="{{ count($headers) + 1 }}" style="text-align: center; padding: 30px">No data available.</td>
                    </tr>
                @endforelse

            </tbody>
        </table>
    </main>

</body>
</html>
