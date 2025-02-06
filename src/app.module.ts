import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { LeaveModule } from './leave/leave.module';
import { SalaryModule } from './salary/salary.module';
import { AttendanceModule } from './attendance/attendance.module';
import { PrismaModule } from 'prisma/prisma.module';
import { RouteRoleModule } from './route-role/route-role.module';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { RouteRoleService } from './route-role/route-role.service';
import { APP_GUARD } from '@nestjs/core';
import { PermissionModule } from './permission/permission.module';
import { ReportModule } from './report/report.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UserModule,
    RoleModule,
    LeaveModule,
    SalaryModule,
    AttendanceModule,
    RouteRoleModule,
    PermissionModule,
    ReportModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard, // Apply JWT authentication globally
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard, // Apply role-based access control globally
    // },
    RouteRoleService, // Required for RolesGuard to fetch route roles
  ],
})
export class AppModule {}
